import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, RotateCcw, Clock, TrendingUp, Activity } from "lucide-react";
import { TimelineEvent, ScenarioData } from "@/lib/scenarioData";

interface RolloutTimelineProps {
  scenarioData: ScenarioData;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "complete":
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-600" strokeWidth={2.5} />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-amber-600" strokeWidth={2.5} />;
    case "alert":
    case "error":
      return <XCircle className="h-5 w-5 text-red-600" strokeWidth={2.5} />;
    case "rollback":
      return <RotateCcw className="h-5 w-5 text-orange-600" strokeWidth={2.5} />;
    case "recovered":
      return <CheckCircle className="h-5 w-5 text-blue-600" strokeWidth={2.5} />;
    case "started":
      return <Clock className="h-5 w-5 text-gray-600" strokeWidth={2.5} />;
    default:
      return <Activity className="h-5 w-5 text-gray-600" strokeWidth={2.5} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "complete":
    case "success":
      return "bg-green-100 border-green-300 text-green-900";
    case "warning":
      return "bg-amber-100 border-amber-300 text-amber-900";
    case "alert":
    case "error":
      return "bg-red-100 border-red-300 text-red-900";
    case "rollback":
      return "bg-orange-100 border-orange-300 text-orange-900";
    case "recovered":
      return "bg-blue-100 border-blue-300 text-blue-900";
    case "started":
      return "bg-gray-100 border-gray-300 text-gray-900";
    default:
      return "bg-gray-100 border-gray-300 text-gray-700";
  }
};

const getProgressBarColor = (status: string) => {
  switch (status) {
    case "complete":
    case "success":
      return "bg-gradient-to-r from-green-500 to-emerald-600";
    case "warning":
      return "bg-gradient-to-r from-amber-500 to-orange-600";
    case "alert":
    case "error":
      return "bg-gradient-to-r from-red-500 to-rose-600";
    case "rollback":
      return "bg-gradient-to-r from-orange-500 to-red-600";
    case "recovered":
      return "bg-gradient-to-r from-blue-500 to-indigo-600";
    default:
      return "bg-gradient-to-r from-blue-500 to-indigo-600";
  }
};

export default function RolloutTimeline({ scenarioData }: RolloutTimelineProps) {
  const { timeline, scenario } = scenarioData;
  const isFailed = scenario === "failed";
  const finalPercentage = timeline[timeline.length - 1]?.percentage || 0;

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold font-sohne text-gray-900">
            Rollout Timeline
          </h4>
          <p className="text-sm text-gray-600 font-sohnelight mt-1">
            {isFailed ? "Rollout failed and recovered" : "Completed successfully"}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
          <TrendingUp className={`h-5 w-5 ${isFailed ? "text-red-600" : "text-green-600"}`} />
          <span className="text-sm font-semibold font-sohne">
            {isFailed ? "Rolled Back" : `${finalPercentage}% Complete`}
          </span>
        </div>
      </div>

      {/* progress bar */}
      <div className="relative">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${finalPercentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-full ${getProgressBarColor(timeline[timeline.length - 1]?.status || "")}`}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 font-sohnelight">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* timeline events */}
      <div className="space-y-3">
        {timeline.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`relative p-4 rounded-xl border-2 ${getStatusColor(event.status)}`}
          >
            {/* timeline connector line */}
            {index < timeline.length - 1 && (
              <div className="absolute left-[30px] top-[60px] w-0.5 h-[calc(100%+12px)] bg-gray-300" />
            )}

            <div className="flex items-start gap-4">
              {/* icon */}
              <div className={`flex-shrink-0 mt-0.5 z-10 bg-white rounded-full p-1`}>
                {getStatusIcon(event.status)}
              </div>

              {/* content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-bold font-sohne">
                      {event.event}
                    </p>
                    <p className="text-xs text-gray-600 font-sohnelight mt-1">
                      {event.displayTime}
                    </p>
                  </div>
                  <span className="text-xs font-semibold bg-white px-3 py-1 rounded-full border">
                    {event.percentage}%
                  </span>
                </div>

                {/* alert message */}
                {event.alertMessage && (
                  <div className="mt-3 p-3 bg-white/50 rounded-lg border border-current">
                    <p className="text-xs font-semibold">
                      {event.alertMessage}
                    </p>
                  </div>
                )}

                {/* metrics */}
                {event.metrics && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {event.metrics.errorRate !== undefined && (
                      <div className="bg-white/50 rounded-lg p-2 border border-gray-300">
                        <p className="text-xs text-gray-600 font-sohnelight">Error Rate</p>
                        <p className="text-sm font-bold font-sohne mt-0.5">
                          {event.metrics.errorRate}%
                        </p>
                      </div>
                    )}
                    {event.metrics.latency !== undefined && (
                      <div className="bg-white/50 rounded-lg p-2 border border-gray-300">
                        <p className="text-xs text-gray-600 font-sohnelight">Latency</p>
                        <p className="text-sm font-bold font-sohne mt-0.5">
                          {event.metrics.latency}ms
                        </p>
                      </div>
                    )}
                    {event.metrics.successRate !== undefined && (
                      <div className="bg-white/50 rounded-lg p-2 border border-gray-300">
                        <p className="text-xs text-gray-600 font-sohnelight">Success Rate</p>
                        <p className="text-sm font-bold font-sohne mt-0.5">
                          {event.metrics.successRate}%
                        </p>
                      </div>
                    )}
                    {event.metrics.notificationVolume !== undefined && (
                      <div className="bg-white/50 rounded-lg p-2 border border-gray-300">
                        <p className="text-xs text-gray-600 font-sohnelight">Notifications</p>
                        <p className="text-sm font-bold font-sohne mt-0.5">
                          {event.metrics.notificationVolume}
                        </p>
                      </div>
                    )}
                    {event.metrics.clientErrors !== undefined && (
                      <div className="bg-white/50 rounded-lg p-2 border border-gray-300">
                        <p className="text-xs text-gray-600 font-sohnelight">Client Errors</p>
                        <p className="text-sm font-bold font-sohne mt-0.5">
                          {event.metrics.clientErrors}%
                        </p>
                      </div>
                    )}
                    {event.metrics.displayLatency !== undefined && (
                      <div className="bg-white/50 rounded-lg p-2 border border-gray-300">
                        <p className="text-xs text-gray-600 font-sohnelight">Display Latency</p>
                        <p className="text-sm font-bold font-sohne mt-0.5">
                          {event.metrics.displayLatency}ms
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* summary for failed scenarios */}
      {isFailed && scenarioData.summary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: timeline.length * 0.1 + 0.3 }}
          className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200"
        >
          <h5 className="text-sm font-bold font-sohne text-gray-900 mb-3">
            Impact Summary
          </h5>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-600 font-sohnelight">Total Duration</p>
              <p className="font-semibold font-sohne mt-0.5">{scenarioData.summary.totalDuration}</p>
            </div>
            <div>
              <p className="text-gray-600 font-sohnelight">Users Affected</p>
              <p className="font-semibold font-sohne mt-0.5">{scenarioData.summary.usersAffected}</p>
            </div>
            <div>
              <p className="text-gray-600 font-sohnelight">Rollback Time</p>
              <p className="font-semibold font-sohne mt-0.5">{scenarioData.summary.rollbackTime}</p>
            </div>
            <div>
              <p className="text-gray-600 font-sohnelight">Impact Contained</p>
              <p className="font-semibold font-sohne mt-0.5">{scenarioData.summary.impactContained}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

