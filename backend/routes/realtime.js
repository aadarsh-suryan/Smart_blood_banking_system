const express = require('express');
const { BloodDonationRecord, BloodRequestRecord, BloodInventory } = require('../models/RealTimeData');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Record a new blood donation
router.post('/donation', async (req, res) => {
  try {
    const {
      donorId,
      donorName,
      bloodType,
      city,
      state,
      hospitalId,
      hospitalName,
      unitsCollected,
      donationType,
      donorAge,
      donorGender,
      isEmergency,
      weather,
      eventType
    } = req.body;

    // Create donation record
    const donation = new BloodDonationRecord({
      donorId,
      donorName,
      bloodType,
      city,
      state,
      hospitalId,
      hospitalName,
      unitsCollected: unitsCollected || 1,
      donationType: donationType || 'whole_blood',
      donorAge,
      donorGender,
      isEmergency: isEmergency || false,
      weather: weather || 'sunny',
      eventType: eventType || 'regular'
    });

    await donation.save();

    // Update blood inventory
    await updateBloodInventory(hospitalId, bloodType, unitsCollected || 1, 'add');

    // Add to ML dataset
    await addToMLDataset('donation', donation);

    // Trigger real-time analytics update
    await updateRealTimeAnalytics();

    res.status(201).json({
      success: true,
      message: 'Blood donation recorded successfully',
      donation: donation
    });

  } catch (error) {
    console.error('Error recording donation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record blood donation'
    });
  }
});

// Record a new blood request
router.post('/request', async (req, res) => {
  try {
    const {
      requesterId,
      requesterName,
      bloodType,
      city,
      state,
      hospitalId,
      hospitalName,
      unitsRequired,
      urgencyLevel,
      patientAge,
      patientGender,
      medicalCondition
    } = req.body;

    // Create request record
    const request = new BloodRequestRecord({
      requesterId,
      requesterName,
      bloodType,
      city,
      state,
      hospitalId,
      hospitalName,
      unitsRequired,
      urgencyLevel,
      patientAge,
      patientGender,
      medicalCondition
    });

    await request.save();

    // Check availability and try to fulfill
    const availableStock = await checkBloodAvailability(hospitalId, bloodType);
    
    if (availableStock >= unitsRequired) {
      // Auto-fulfill if stock available
      request.isFulfilled = true;
      request.fulfilledDate = new Date();
      request.fulfilledUnits = unitsRequired;
      await request.save();

      // Update inventory
      await updateBloodInventory(hospitalId, bloodType, unitsRequired, 'subtract');
    }

    // Add to ML dataset
    await addToMLDataset('request', request);

    // Trigger real-time analytics update
    await updateRealTimeAnalytics();

    res.status(201).json({
      success: true,
      message: 'Blood request recorded successfully',
      request: request,
      availableStock: availableStock,
      isFulfilled: request.isFulfilled
    });

  } catch (error) {
    console.error('Error recording request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record blood request'
    });
  }
});

// Get real-time blood inventory
router.get('/inventory/:hospitalId', async (req, res) => {
  try {
    const { hospitalId } = req.params;
    
    const inventory = await BloodInventory.find({ hospitalId });
    
    res.json({
      success: true,
      inventory: inventory
    });

  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory'
    });
  }
});

// Get real-time analytics dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get today's donations and requests
    const todayDonations = await BloodDonationRecord.countDocuments({
      donationDate: { $gte: new Date(today.setHours(0, 0, 0, 0)) }
    });

    const todayRequests = await BloodRequestRecord.countDocuments({
      requestDate: { $gte: new Date(today.setHours(0, 0, 0, 0)) }
    });

    // Get weekly trends
    const weeklyDonations = await BloodDonationRecord.aggregate([
      { $match: { donationDate: { $gte: lastWeek } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$donationDate" } },
          count: { $sum: 1 },
          units: { $sum: "$unitsCollected" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const weeklyRequests = await BloodRequestRecord.aggregate([
      { $match: { requestDate: { $gte: lastWeek } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$requestDate" } },
          count: { $sum: 1 },
          units: { $sum: "$unitsRequired" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Blood type distribution (last month)
    const bloodTypeStats = await BloodDonationRecord.aggregate([
      { $match: { donationDate: { $gte: lastMonth } } },
      {
        $group: {
          _id: "$bloodType",
          donations: { $sum: 1 },
          units: { $sum: "$unitsCollected" }
        }
      }
    ]);

    // City-wise distribution
    const cityStats = await BloodDonationRecord.aggregate([
      { $match: { donationDate: { $gte: lastMonth } } },
      {
        $group: {
          _id: "$city",
          donations: { $sum: 1 },
          units: { $sum: "$unitsCollected" }
        }
      },
      { $sort: { units: -1 } },
      { $limit: 10 }
    ]);

    // Critical requests (unfulfilled high/critical urgency)
    const criticalRequests = await BloodRequestRecord.countDocuments({
      isFulfilled: false,
      urgencyLevel: { $in: ['high', 'critical'] }
    });

    res.json({
      success: true,
      realTimeStats: {
        todayDonations,
        todayRequests,
        criticalRequests,
        weeklyDonations,
        weeklyRequests,
        bloodTypeStats,
        cityStats
      }
    });

  } catch (error) {
    console.error('Error fetching real-time dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
});

// Helper functions
async function updateBloodInventory(hospitalId, bloodType, units, operation) {
  try {
    let inventory = await BloodInventory.findOne({ hospitalId, bloodType });
    
    if (!inventory) {
      inventory = new BloodInventory({
        hospitalId,
        bloodType,
        currentStock: 0
      });
    }

    if (operation === 'add') {
      inventory.currentStock += units;
    } else if (operation === 'subtract') {
      inventory.currentStock = Math.max(0, inventory.currentStock - units);
    }

    inventory.lastUpdated = new Date();
    await inventory.save();

    return inventory;
  } catch (error) {
    console.error('Error updating inventory:', error);
  }
}

async function checkBloodAvailability(hospitalId, bloodType) {
  try {
    const inventory = await BloodInventory.findOne({ hospitalId, bloodType });
    return inventory ? inventory.currentStock : 0;
  } catch (error) {
    console.error('Error checking availability:', error);
    return 0;
  }
}

async function addToMLDataset(type, record) {
  try {
    const dataPoint = {
      date: record.donationDate || record.requestDate,
      city: record.city,
      blood_type: record.bloodType,
      type: type, // 'donation' or 'request'
      units: record.unitsCollected || record.unitsRequired,
      urgency: record.urgencyLevel || 'normal',
      is_emergency: record.isEmergency || false,
      weather: record.weather || 'unknown',
      age: record.donorAge || record.patientAge,
      gender: record.donorGender || record.patientGender
    };

    // Append to real-time dataset file
    const csvLine = Object.values(dataPoint).join(',') + '\n';
    const filePath = path.join(__dirname, '../realtime_data.csv');
    
    // Create header if file doesn't exist
    if (!fs.existsSync(filePath)) {
      const header = Object.keys(dataPoint).join(',') + '\n';
      fs.writeFileSync(filePath, header);
    }

    fs.appendFileSync(filePath, csvLine);
    
  } catch (error) {
    console.error('Error adding to ML dataset:', error);
  }
}

async function updateRealTimeAnalytics() {
  try {
    // Trigger ML model update with new data
    console.log('Triggering real-time analytics update...');
    
    // This could spawn a Python process to retrain or update predictions
    const pythonProcess = spawn('python', ['update_realtime_model.py'], {
      cwd: __dirname.replace('routes', ''),
      stdio: 'inherit'
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Real-time analytics updated successfully');
      } else {
        console.error('Failed to update real-time analytics');
      }
    });

  } catch (error) {
    console.error('Error updating real-time analytics:', error);
  }
}

module.exports = router;
