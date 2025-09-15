import React, { useState, useEffect } from 'react';
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { Bell, AlertCircle, CheckCircle2, Clock, Zap, Shield, Globe, Users, ChevronDown, ChevronUp } from 'lucide-react';

const RiskAlertsPanel = () => {
  const flags = useFlags();
  const client = useLDClient();
  const riskmgmtAPIFlag = flags["riskmgmtbureauAPIGuardedRelease"];
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // simulate API responses
  const apiV1Data = {
    version: "API v1.0",
    responseTime: "850ms",
    features: ["Basic Alerts", "Standard Severity"],
    alerts: [
      {
        id: 1,
        type: "warning",
        title: "Security Alert",
        message: "Unusual activity detected",
        timestamp: "2 hours ago",
        severity: "Medium"
      },
      {
        id: 2,
        type: "info",
        title: "System Update",
        message: "Scheduled maintenance",
        timestamp: "4 hours ago", 
        severity: "Low"
      },
      {
        id: 3,
        type: "error",
        title: "Access Denied",
        message: "Unauthorized access attempt",
        timestamp: "6 hours ago",
        severity: "High"
      }
    ]
  };

  const apiV2Data = {
    version: "API v2.0",
    responseTime: "120ms",
    features: ["Real-time Alerts", "Advanced Analytics", "Threat Intelligence", "Auto-Response"],
    alerts: [
      {
        id: 1,
        type: "critical",
        title: "Critical Security Breach",
        message: "Multiple failed login attempts from foreign IP addresses detected in Northeast region",
        timestamp: "30 seconds ago",
        severity: "Critical",
        location: "Northeast Regional Center",
        affectedSystems: 3,
        autoResponse: "Access blocked automatically",
        threatLevel: "Nation-state actor"
      },
      {
        id: 2,
        type: "warning", 
        title: "Anomalous Network Traffic",
        message: "Unusual data transfer patterns identified in government network infrastructure",
        timestamp: "2 minutes ago",
        severity: "High",
        location: "Southwest Data Center", 
        affectedSystems: 1,
        autoResponse: "Traffic analysis initiated",
        threatLevel: "Advanced persistent threat"
      },
      {
        id: 3,
        type: "info",
        title: "Threat Intelligence Update",
        message: "New vulnerability signatures added to detection systems",
        timestamp: "5 minutes ago",
        severity: "Medium",
        location: "All Regions",
        affectedSystems: 0,
        autoResponse: "Signatures deployed",
        threatLevel: "Preventive measure"
      },
      {
        id: 4,
        type: "success",
        title: "Threat Neutralized",
        message: "Malware campaign successfully blocked across all government endpoints",
        timestamp: "10 minutes ago",
        severity: "Low",
        location: "National Network",
        affectedSystems: 0,
        autoResponse: "All systems secured",
        threatLevel: "Resolved"
      },
      {
        id: 5,
        type: "warning",
        title: "Compliance Alert",
        message: "Security clearance verification required for 12 users in classified systems",
        timestamp: "15 minutes ago",
        severity: "Medium",
        location: "Secure Facilities",
        affectedSystems: 2,
        autoResponse: "Access suspended pending review",
        threatLevel: "Policy enforcement"
      }
    ]
  };

  const currentData = riskmgmtAPIFlag ? apiV2Data : apiV1Data;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical": return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "error": return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning": return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info": return <Bell className="h-5 w-5 text-blue-500" />;
      case "success": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // simulate real time updates
  useEffect(() => {
    if (riskmgmtAPIFlag) {
      const interval = setInterval(() => {
        setAlerts(currentData.alerts.map(alert => ({
          ...alert,
          timestamp: alert.id === 1 ? `${Math.floor(Math.random() * 60)} seconds ago` : alert.timestamp
        })));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [riskmgmtAPIFlag]);

  useEffect(() => {
    setAlerts(currentData.alerts);
  }, [riskmgmtAPIFlag]);

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
              <Bell className="h-8 w-8 text-governmentBlue" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Real-time Risk Alerts</h2>
                <p className="text-sm text-gray-600">Automated threat detection and response system</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{currentData.version}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">{currentData.responseTime}</span>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Hide Alerts
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show Alerts
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* collapse content here */}
        {isExpanded && (
          <>
            {/* features bar */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium text-gray-700">Features:</span>
            {currentData.features.map((feature, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* alerts */}
        <div className="px-6 py-4">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-gray-500">{alert.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{alert.message}</p>
                    
                    {/* enhanced API v2.0 features */}
                    {riskmgmtAPIFlag && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Affected Systems:</span>
                          <span className="font-medium">{alert.affectedSystems}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Auto-Response:</span>
                          <span className="font-medium text-green-700">{alert.autoResponse}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Threat Level:</span>
                          <span className="font-medium">{alert.threatLevel}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

            {/* footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Powered by {riskmgmtAPIFlag ? "Enhanced Risk Management API v2.0" : "Standard Risk API v1.0"}
                </span>
                <span>
                  {riskmgmtAPIFlag ? `${alerts.length} real-time alerts • Auto-response enabled` : `${alerts.length} basic alerts • Manual review required`}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RiskAlertsPanel; 