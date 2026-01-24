# Blood Analytics Setup Script

echo "Setting up Blood Analytics with Machine Learning..."

# Install Python packages for ML
echo "Installing Python packages..."
pip install pandas numpy scikit-learn matplotlib seaborn joblib

# Install React Chart.js packages
echo "Installing React Chart.js packages..."
npm install chart.js react-chartjs-2

echo "Setup completed!"
echo ""
echo "To generate dataset and train model:"
echo "1. cd backend"
echo "2. python generate_dataset.py"
echo "3. python train_model.py"
echo ""
echo "Features included:"
echo "- Regional blood demand analysis"
echo "- Seasonal trend prediction"
echo "- Blood type distribution analytics"
echo "- Machine Learning predictions"
echo "- Interactive charts and graphs"
echo "- Critical period identification"
