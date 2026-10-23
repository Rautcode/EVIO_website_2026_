// Cities a case study can be pinned to from the admin panel (lat/lon for the project map).
// Names matching MAP_CITIES join that marker; any other city gets its own marker.
export const INDIA_CITIES = [
    ['Agra', 27.18, 78.01], ['Ahmedabad & Gandhinagar', 23.10, 72.60], ['Aurangabad', 19.88, 75.34], ['Bargarh', 21.33, 83.62],
    ['Bengaluru', 12.97, 77.59], ['Bhavnagar', 21.76, 72.15], ['Bhopal', 23.26, 77.41], ['Bhubaneswar', 20.30, 85.82],
    ['Chandigarh', 30.73, 76.78], ['Chennai', 13.08, 80.27], ['Coimbatore', 11.02, 76.96], ['Dehradun', 30.32, 78.03],
    ['Delhi NCR', 28.61, 77.21], ['Goa', 15.49, 73.83], ['Guwahati', 26.14, 91.74], ['Halol', 22.50, 73.47],
    ['Hyderabad', 17.39, 78.49], ['Indore', 22.72, 75.86], ['Jaipur', 26.91, 75.79], ['Jamshedpur', 22.80, 86.20],
    ['Kochi', 9.93, 76.27], ['Kolkata', 22.57, 88.36], ['Lucknow', 26.85, 80.95], ['Ludhiana', 30.90, 75.86],
    ['Madurai', 9.93, 78.12], ['Mangaluru', 12.91, 74.86], ['Mumbai & Navi Mumbai', 19.08, 72.88], ['Mysuru', 12.30, 76.64],
    ['Nagpur', 21.15, 79.09], ['Nashik', 20.00, 73.79], ['Patna', 25.59, 85.14], ['Pune', 18.52, 73.86],
    ['Raipur', 21.25, 81.63], ['Rajkot', 22.30, 70.80], ['Ranchi', 23.34, 85.31], ['Surat', 21.17, 72.83],
    ['Thiruvananthapuram', 8.52, 76.94], ['Vadodara', 22.31, 73.18], ['Varanasi', 25.32, 82.97], ['Visakhapatnam', 17.69, 83.22],
].map(([city, lat, lon]) => ({ city, lat, lon }));
