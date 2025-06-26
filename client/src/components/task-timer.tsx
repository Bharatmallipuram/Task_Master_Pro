import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TaskWithProject } from "@shared/schema";

interface TaskTimerProps {
  tasks: TaskWithProject[];
  onEditTask: (task: TaskWithProject) => void;
}

interface TimerSession {
  taskId: number;
  startTime: Date;
  duration: number; // in seconds
  isActive: boolean;
}

export default function TaskTimer({ tasks, onEditTask }: TaskTimerProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [currentSession, setCurrentSession] = useState<TimerSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessions, setSessions] = useState<TimerSession[]>([]);

  const activeTasks = tasks.filter(task => !task.completed);
  const selectedTask = tasks.find(task => task.id.toString() === selectedTaskId);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentSession?.isActive) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - currentSession.startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentSession]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!selectedTaskId) return;
    
    const session: TimerSession = {
      taskId: parseInt(selectedTaskId),
      startTime: new Date(),
      duration: 0,
      isActive: true,
    };
    
    setCurrentSession(session);
    setElapsedTime(0);
  };

  const pauseTimer = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        isActive: false,
        duration: elapsedTime,
      });
    }
  };

  const resumeTimer = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        isActive: true,
        startTime: new Date(Date.now() - elapsedTime * 1000),
      });
    }
  };

  const stopTimer = () => {
    if (currentSession) {
      const finalSession = {
        ...currentSession,
        isActive: false,
        duration: elapsedTime,
      };
      
      setSessions(prev => [...prev, finalSession]);
      setCurrentSession(null);
      setElapsedTime(0);
    }
  };

  const resetTimer = () => {
    setCurrentSession(null);
    setElapsedTime(0);
  };

  const getTotalTimeForTask = (taskId: number) => {
    return sessions
      .filter(session => session.taskId === taskId)
      .reduce((total, session) => total + session.duration, 0);
  };

  const getSessionsForTask = (taskId: number) => {
    return sessions.filter(session => session.taskId === taskId);
  };

  return (
    <div className="px-6 pb-6 space-y-6">
      {/* Timer Control */}
      <Card>
        <CardHeader>
          <CardTitle>Task Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Task Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Task</label>
            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a task to time" />
              </SelectTrigger>
              <SelectContent>
                {activeTasks.map(task => (
                  <SelectItem key={task.id} value={task.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <span>{task.title}</span>
                      <Badge className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timer Display */}
          <div className="text-center">
            <motion.div
              className="text-6xl font-mono font-bold text-gray-900 mb-4"
              animate={currentSession?.isActive ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {formatTime(elapsedTime)}
            </motion.div>
            
            {selectedTask && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{selectedTask.title}</h3>
                <p className="text-sm text-gray-600">{selectedTask.description}</p>
              </div>
            )}

            {/* Timer Controls */}
            <div className="flex items-center justify-center space-x-3">
              {!currentSession ? (
                <Button 
                  onClick={startTimer} 
                  disabled={!selectedTaskId}
                  className="flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Start</span>
                </Button>
              ) : currentSession.isActive ? (
                <Button 
                  onClick={pauseTimer}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </Button>
              ) : (
                <Button 
                  onClick={resumeTimer}
                  className="flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </Button>
              )}
              
              {currentSession && (
                <>
                  <Button 
                    onClick={stopTimer}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Square className="w-4 h-4" />
                    <span>Stop</span>
                  </Button>
                  <Button 
                    onClick={resetTimer}
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Tracking Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Time Tracking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeTasks.map(task => {
              const totalTime = getTotalTimeForTask(task.id);
              const sessionCount = getSessionsForTask(task.id).length;
              
              if (totalTime === 0) return null;
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">
                      {sessionCount} session{sessionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {formatTime(totalTime)}
                    </div>
                    <Badge className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
            
            {sessions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-lg mb-2">No time tracked yet</div>
                <div className="text-sm">
                  Start timing your tasks to see tracking data
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}