import type { workspace } from "../types/workspace";

export const dummyWorkspaces: workspace[] = [
  {
    workspace_id: 1,
    owner_id: 1,
    team_name: "SmartCity Team A",
    project_name: "Air Quality Monitoring",
    created_at: new Date("2024-11-01T10:00:00Z"),
    project_target: "Improve urban air quality around bus stops.",
    project_description:
      "This project collects air quality data from various bus stops and analyzes it to improve environmental health conditions.",
    project_summary: "An IoT and data-driven approach to urban air quality.",
    project_features: JSON.stringify([
      "Real-time PM10/PM2.5 sensors",
      "Public dashboard",
      "Alert system for poor air",
    ]),
    is_shared_agree: true,
    is_completed: false,
  },
  {
    workspace_id: 2,
    owner_id: 1,
    team_name: "CityVision Team",
    project_name: "Bus Stop Usage Optimization",
    created_at: new Date("2025-02-15T15:30:00Z"),
    project_target: "Analyze and optimize passenger flow at smart bus stops.",
    project_description:
      "Uses sensor and statistical data to understand and improve bus stop usage patterns.",
    project_summary: "Enhancing efficiency in public transport waiting zones.",
    project_features: JSON.stringify([
      "Usage heatmaps",
      "Peak-hour traffic prediction",
      "Smart routing suggestions",
    ]),
    is_shared_agree: false,
    is_completed: true,
  },
  {
    workspace_id: 3,
    owner_id: 2,
    team_name: "CityVision Team",
    project_name: "Bus Stop Usage Optimization",
    created_at: new Date("2025-02-15T15:30:00Z"),
    project_target: "Analyze and optimize passenger flow at smart bus stops.",
    project_description:
      "Uses sensor and statistical data to understand and improve bus stop usage patterns.",
    project_summary: "Enhancing efficiency in public transport waiting zones.",
    project_features: JSON.stringify([
      "Usage heatmaps",
      "Peak-hour traffic prediction",
      "Smart routing suggestions",
    ]),
    is_shared_agree: false,
    is_completed: true,
  },
  {
    workspace_id: 4,
    owner_id: 1,
    team_name: "SmartCity Team A",
    project_name: "Air Quality Monitoring",
    created_at: new Date("2024-11-01T10:00:00Z"),
    project_target: "Improve urban air quality around bus stops.",
    project_description:
      "This project collects air quality data from various bus stops and analyzes it to improve environmental health conditions.",
    project_summary: "An IoT and data-driven approach to urban air quality.",
    project_features: JSON.stringify([
      "Real-time PM10/PM2.5 sensors",
      "Public dashboard",
      "Alert system for poor air",
    ]),
    is_shared_agree: true,
    is_completed: false,
  },
  {
    workspace_id: 5,
    owner_id: 1,
    team_name: "SmartCity Team A",
    project_name: "Air Quality Monitoring",
    created_at: new Date("2024-11-01T10:00:00Z"),
    project_target: "Improve urban air quality around bus stops.",
    project_description:
      "This project collects air quality data from various bus stops and analyzes it to improve environmental health conditions.",
    project_summary: "An IoT and data-driven approach to urban air quality.",
    project_features: JSON.stringify([
      "Real-time PM10/PM2.5 sensors",
      "Public dashboard",
      "Alert system for poor air",
    ]),
    is_shared_agree: true,
    is_completed: false,
  },
  {
    workspace_id: 6,
    owner_id: 1,
    team_name: "SmartCity Team A",
    project_name: "Air Quality Monitoring",
    created_at: new Date("2024-11-01T10:00:00Z"),
    project_target: "Improve urban air quality around bus stops.",
    project_description:
      "This project collects air quality data from various bus stops and analyzes it to improve environmental health conditions.",
    project_summary: "An IoT and data-driven approach to urban air quality.",
    project_features: JSON.stringify([
      "Real-time PM10/PM2.5 sensors",
      "Public dashboard",
      "Alert system for poor air",
    ]),
    is_shared_agree: true,
    is_completed: false,
  },
];
