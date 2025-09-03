import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import ChartComponent from '../components/ChartComponent';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';


const Analytics = () => {
  const [loading, setLoading] = useState(true);
 const [analyticsData, setAnalyticsData] = useState({
      genderDistribution: [],
      ageDistribution: [],
      diseaseDistribution: [],
      patientsOverTime: []
    });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = () => {
    setLoading(true);

    const genderData = [
      { name: 'Male', value: 120 },
      { name: 'Female', value: 100 },
      { name: 'Other', value: 5 },
    ];

    const ageData = [
      { name: '0-18', value: 50 },
      { name: '19-35', value: 90 },
      { name: '36-50', value: 60 },
      { name: '51-65', value: 20 },
      { name: '65+', value: 5 },
    ];

    const diseaseData = [
      { name: 'Diabetes', value: 30 },
      { name: 'Hypertension', value: 40 },
      { name: 'Asthma', value: 15 },
      { name: 'Heart Disease', value: 25 },
      { name: 'Covid-19', value: 10 },
    ];

    const patientsOverTime = [
      { name: 'Jan', value: 10 },
      { name: 'Feb', value: 25 },
      { name: 'Mar', value: 40 },
      { name: 'Apr', value: 60 },
      { name: 'May', value: 80 },
      { name: 'Jun', value: 100 },
    ];

    setAnalyticsData({
    genderDistribution: genderData,
    ageDistribution: ageData,
    diseaseDistribution: diseaseData,
    patientsOverTime: patientsOverTime,
  });

  // Stop loading
  setLoading(false);
  }
 
  // const fetchAnalyticsData = async () => {
  //   try {
  //     setLoading(true);

  //     const [
  //       genderResponse,
  //       ageResponse,
  //       diseaseResponse,
  //       timeResponse
  //     ] = await Promise.all([
  //       analyticsAPI.getGenderDistribution(),
  //       analyticsAPI.getAgeDistribution(),
  //       analyticsAPI.getDiseaseDistribution(),
  //       analyticsAPI.getPatientsOverTime()
  //     ]);

  //     setAnalyticsData({
  //       genderDistribution: genderResponse.data,
  //       ageDistribution: ageResponse.data,
  //       diseaseDistribution: diseaseResponse.data,
  //       patientsOverTime: timeResponse.data
  //     });
  //   } catch (error) {
  //     console.error('Error fetching analytics data:', error);
  //     toast.error('Failed to load analytics data');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const StatCard = ({ title, value, description, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
          <span className="text-white font-bold text-lg">{value}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Loader size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights into patient demographics and trends</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={analyticsData.genderDistribution.reduce((sum, item) => sum + item.value, 0)}
          description="Registered patients"
          color="bg-blue-500"
        />
        <StatCard
          title="Male Patients"
          value={analyticsData.genderDistribution.find(item => item.name === 'Male')?.value || 0}
          description="Male population"
          color="bg-green-500"
        />
        <StatCard
          title="Female Patients"
          value={analyticsData.genderDistribution.find(item => item.name === 'Female')?.value || 0}
          description="Female population"
          color="bg-pink-500"
        />
        <StatCard
          title="Other"
          value={analyticsData.genderDistribution.find(item => item.name === 'Other')?.value || 0}
          description="Other gender"
          color="bg-purple-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <ChartComponent
          data={analyticsData.genderDistribution}
          type="pie"
          title="Gender Distribution"
          height={300}
        />

        {/* Age Distribution */}
        <ChartComponent
          data={analyticsData.ageDistribution}
          type="bar"
          title="Age Distribution"
          height={300}
        />

        {/* Disease Distribution */}
        <ChartComponent
          data={analyticsData.diseaseDistribution}
          type="bar"
          title="Common Medical Conditions"
          height={300}
        />

        {/* Patients Over Time */}
        <ChartComponent
          data={analyticsData.patientsOverTime}
          type="line"
          title="Patients Added Over Time"
          height={300}
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Groups Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Groups Breakdown</h3>
          <div className="space-y-3">
            {analyticsData.ageDistribution.map((ageGroup, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{ageGroup.name}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(ageGroup.value / Math.max(...analyticsData.ageDistribution.map(item => item.value))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{ageGroup.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Medical Conditions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Medical Conditions</h3>
          <div className="space-y-3">
            {analyticsData.diseaseDistribution.slice(0, 5).map((disease, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{disease.name}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${(disease.value / Math.max(...analyticsData.diseaseDistribution.map(item => item.value))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{disease.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Patient Growth</h4>
            <p className="text-sm text-blue-700">
              {analyticsData.patientsOverTime.length > 1
                ? `Growth rate: ${((analyticsData.patientsOverTime[analyticsData.patientsOverTime.length - 1].value - analyticsData.patientsOverTime[0].value) / analyticsData.patientsOverTime[0].value * 100).toFixed(1)}%`
                : 'Insufficient data for growth analysis'
              }
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Gender Balance</h4>
            <p className="text-sm text-green-700">
              {analyticsData.genderDistribution.length > 0
                ? `Most common: ${analyticsData.genderDistribution.reduce((max, item) => item.value > max.value ? item : max).name}`
                : 'No gender data available'
              }
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Age Distribution</h4>
            <p className="text-sm text-yellow-700">
              {analyticsData.ageDistribution.length > 0
                ? `Most common age group: ${analyticsData.ageDistribution.reduce((max, item) => item.value > max.value ? item : max).name}`
                : 'No age data available'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
