import React, { useState } from 'react';
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { TrendingUp, Database, Shield, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface RiskScore {
  region: string;
  level: string;
  score: number;
  trend?: string;
  threats?: number;
}

const RiskAssessmentDashboard = () => {
  const flags = useFlags();
  const client = useLDClient();
  const riskmgmtDBFlag = flags["riskmgmtbureauDBGuardedRelease"];
  const [isExpanded, setIsExpanded] = useState(false);

  // simulate different data
  const legacyData = {
    responseTime: "245ms",
    version: "Legacy DB v1.2",
    riskScores: [
      { region: "Northeast", level: "Medium", score: 65 },
      { region: "Southeast", level: "High", score: 82 },
      { region: "West Coast", level: "Low", score: 34 }
    ] as RiskScore[],
    connectionStatus: "Connected",
    lastUpdate: "5 minutes ago",
    dataPoints: 3,
    loading: false
  };

  const enhancedData = {
    responseTime: "12ms",
    version: "Enhanced DB v2.0",
    riskScores: [
      { region: "Northeast", level: "Medium", score: 65, trend: "+2.3%", threats: 12 },
      { region: "Southeast", level: "High", score: 82, trend: "-1.8%", threats: 28 },
      { region: "West Coast", level: "Low", score: 34, trend: "+0.5%", threats: 8 },
      { region: "Midwest", level: "Medium", score: 58, trend: "+4.1%", threats: 15 },
      { region: "Southwest", level: "Low", score: 41, trend: "-2.2%", threats: 9 }
    ] as RiskScore[],
    connectionStatus: "High-Performance Connection",
    lastUpdate: "Real-time",
    dataPoints: 5,
    loading: false
  };

  const currentData = riskmgmtDBFlag ? enhancedData : legacyData;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  // get current user context
  const context = client?.getContext() as any;
  const userRole = context?.user?.role;
  const isLoggedIn = context?.user && !context?.user?.anonymous;
  
  // only showing for beta users
  const isBetaUser = isLoggedIn && userRole === "Beta";
  
  if (!isBetaUser) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* header - visible */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-governmentBlue" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Risk Assessment Dashboard</h2>
                <p className="text-sm text-gray-600">Real-time threat monitoring and analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{currentData.version}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${riskmgmtDBFlag ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm text-gray-600">{currentData.connectionStatus}</span>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show Details
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* collapse content here */}
        {isExpanded && (
          <>
            {/* metric row */}
            <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Response Time</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-1">{currentData.responseTime}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Data Points</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-1">{currentData.dataPoints}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Last Update</span>
              </div>
              <p className="text-lg font-bold text-purple-900 mt-1">{currentData.lastUpdate}</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">System Status</span>
              </div>
              <p className="text-lg font-bold text-orange-900 mt-1">
                {riskmgmtDBFlag ? "Enhanced" : "Standard"}
              </p>
            </div>
          </div>
        </div>

        {/* risk scores table */}
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Risk Assessment</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Region</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Risk Level</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                  {riskmgmtDBFlag && (
                    <>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Trend</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Active Threats</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentData.riskScores.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{item.region}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(item.level)}`}>
                        {item.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.score}</td>
                    {riskmgmtDBFlag && (
                      <>
                        <td className="py-3 px-4">
                          <span className={`font-medium ${item.trend?.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                            {item.trend}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{item.threats}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

            {/* footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Powered by {riskmgmtDBFlag ? "Enhanced Risk Management Database v2.0" : "Legacy Risk Database v1.2"}
                </span>
                <span>
                  {riskmgmtDBFlag ? "Advanced analytics enabled" : "Basic monitoring active"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RiskAssessmentDashboard; 