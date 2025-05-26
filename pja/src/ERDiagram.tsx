import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

export default function ERDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [svgCode, setSvgCode] = useState("");
  const [zoom, setZoom] = useState(1);

  const diagram = `
    erDiagram
   BUS_STOPS {
       int stop_id PK
       varchar stop_name
       varchar stop_code
       decimal latitude
       decimal longitude
       varchar address
       varchar district
       boolean is_smart_stop
       datetime created_at
       datetime updated_at
   }
   
   AIR_QUALITY_DATA {
       int data_id PK
       int stop_id FK
       decimal pm10_level
       decimal pm25_level
       decimal co2_level
       decimal temperature
       decimal humidity
       datetime measured_at
       varchar data_source
   }
   
   CITIZEN_COMPLAINTS {
       int complaint_id PK
       varchar complaint_text
       varchar category
       varchar location
       datetime submitted_at
       varchar source_platform
       boolean is_processed
   }
   
   USAGE_STATISTICS {
       int usage_id PK
       int stop_id FK
       int daily_passengers
       int peak_hour_passengers
       date usage_date
       varchar day_of_week
       varchar weather_condition
   }
   
   DEMOGRAPHICS {
       int demo_id PK
       varchar district
       int elderly_population
       int child_population
       int total_population
       decimal elderly_ratio
       decimal child_ratio
       int year
   }
   
   TRANSPORTATION_DATA {
       int transport_id PK
       varchar district
       decimal bus_share_ratio
       decimal subway_share_ratio
       decimal car_share_ratio
       decimal public_transport_ratio
       int year
   }
   
   LOCATION_FACTORS {
       int factor_id PK
       int stop_id FK
       decimal distance_to_hospital
       decimal distance_to_school
       decimal distance_to_commercial
       decimal distance_to_residential
       decimal accessibility_score
       boolean near_subway_station
   }
   
   SMART_FACILITIES {
       int facility_id PK
       int stop_id FK
       boolean has_screen_door
       boolean has_air_curtain
       boolean has_air_purifier
       boolean has_heating_cooling
       boolean has_wifi
       boolean has_cctv
       boolean has_emergency_bell
       datetime installed_at
   }
   
   ANALYSIS_RESULTS {
       int analysis_id PK
       int stop_id FK
       decimal pca_score1
       decimal pca_score2
       decimal pca_score3
       int cluster_group
       decimal silhouette_score
       decimal priority_score
       varchar recommendation
       datetime analyzed_at
   }
   
   ENVIRONMENTAL_FACTORS {
       int env_id PK
       int stop_id FK
       decimal pollution_level
       decimal noise_level
       decimal green_space_ratio
       decimal traffic_volume
       varchar wind_direction
       decimal temperature_variance
   }
   
   PERFORMANCE_METRICS {
       int metric_id PK
       int stop_id FK
       int usage_increase_rate
       decimal satisfaction_score
       decimal air_quality_improvement
       int complaint_reduction_rate
       date measurement_date
   }

   %% Relationships
   BUS_STOPS ||--o{ AIR_QUALITY_DATA : monitors
   BUS_STOPS ||--o{ USAGE_STATISTICS : records
   BUS_STOPS ||--o{ LOCATION_FACTORS : has
   BUS_STOPS ||--o{ SMART_FACILITIES : equipped_with
   BUS_STOPS ||--o{ ANALYSIS_RESULTS : analyzed_for
   BUS_STOPS ||--o{ ENVIRONMENTAL_FACTORS : measured_at
   BUS_STOPS ||--o{ PERFORMANCE_METRICS : evaluated_by
   
   DEMOGRAPHICS ||--o{ BUS_STOPS : influences
   TRANSPORTATION_DATA ||--o{ BUS_STOPS : affects
  `;

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    const render = async () => {
      try {
        const { svg } = await mermaid.render(
          `graph-${Math.random().toString(36).substring(2, 8)}`,
          diagram
        );
        setSvgCode(svg);
      } catch (e) {
        console.error("Mermaid render failed", e);
      }
    };
    render();
  }, []);

  return (
    <>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}>
          확대 +
        </button>
        <button onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}>
          축소 -
        </button>
      </div>
      <div
        className="mermaid"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          border: "1px solid #ccc",
          overflow: "auto",
        }}
        dangerouslySetInnerHTML={{ __html: svgCode }}
      />
    </>
  );
}
