import bcrypt from "bcryptjs";

export const createSeedData = async () => {
  const hashedPassword = await bcrypt.hash("Password@123", 10);

  const users = [
    {
      id: "usr-admin-01",
      name: "Dr. M. Mohapatra",
      email: "admin@imd.gov.in",
      password: hashedPassword,
      role: "admin",
      status: "approved",
      organization: "India Meteorological Department (IMD)",
      department: "Directorate General",
      designation: "Director General of Meteorology",
      phone: "+91 11 2461 1060",
      skills: ["Executive Training", "Meteorological Operations", "Policy", "Disaster Management"],
      qualifications: "Ph.D. in Meteorology, M.Sc. Physics",
      experience: "28+ years in Cyclone Warning & Meteorological Leadership",
      interests: ["Extreme Weather Forecasting", "Capacity Building", "AI in Meteorology"],
      certificates: [
        { title: "WMO Senior Meteorological Executive Award", issuer: "World Meteorological Organization", year: 2021 }
      ],
      createdAt: "2026-01-01T00:00:00.000Z"
    },
    {
      id: "usr-trainer-01",
      name: "Dr. Sunitha Sharma",
      email: "trainer@imd.gov.in",
      password: hashedPassword,
      role: "trainer",
      status: "approved",
      organization: "Ministry of Earth Sciences (MoES)",
      department: "Radar & Satellite Meteorology Division",
      designation: "Scientist 'F' / Senior Radar Specialist",
      phone: "+91 98112 34567",
      skills: ["Doppler Weather Radar (DWR)", "Radar Echo Interpretation", "Nowcasting", "Severe Storm Analysis"],
      qualifications: "Ph.D. Atmospheric Sciences (IIT Delhi), M.Tech Remote Sensing",
      experience: "16 years in Radar Observation Networks & Severe Convection Analysis",
      interests: ["Dual-Pol Radar", "Hailstorm Detection", "Trainer Mentorship"],
      certificates: [
        { title: "Certified Radar Operations Instructor", issuer: "WMO RTC Pune", year: 2022 },
        { title: "Advanced Dual-Polarization Radar Analysis", issuer: "NOAA Radar Operations Center", year: 2024 }
      ],
      createdAt: "2026-01-05T00:00:00.000Z"
    },
    {
      id: "usr-trainer-02",
      name: "Prof. Rajesh K. Varma",
      email: "rajesh.varma@imd.gov.in",
      password: hashedPassword,
      role: "trainer",
      status: "approved",
      organization: "National Centre for Medium Range Weather Forecasting (NCMRWF)",
      department: "Numerical Modeling Group",
      designation: "Chief Scientist & Modeling Chair",
      phone: "+91 98765 43210",
      skills: ["Numerical Weather Prediction (NWP)", "WRF Modeling", "Data Assimilation", "Python Meteorology"],
      qualifications: "Ph.D. Physical Oceanography & Meteorology, IISc Bangalore",
      experience: "19 years in High-Performance Computing & Global Climate Simulations",
      interests: ["Monsoon Dynamics", "Ensemble Prediction Systems", "Supercomputing"],
      certificates: [
        { title: "Excellence in Atmospheric Modeling", issuer: "MoES India", year: 2023 }
      ],
      createdAt: "2026-01-10T00:00:00.000Z"
    },
    {
      id: "usr-trainee-01",
      name: "Amit Sengupta",
      email: "trainee@imd.gov.in",
      password: hashedPassword,
      role: "trainee",
      status: "approved",
      organization: "IMD Regional Meteorological Centre, Kolkata",
      department: "Cyclone Early Warning & Observations",
      designation: "Scientific Assistant",
      phone: "+91 94330 98765",
      skills: ["Surface Observations", "Synoptic Chart Analysis", "Python Scripting"],
      qualifications: "M.Sc. in Physics (Presidency Univ), P.G. Diploma in Meteorology",
      experience: "3 years in Synoptic Weather Observation & Coastal Station Ops",
      interests: ["Bay of Bengal Cyclones", "Doppler Radar Interpretation", "Radar Nowcasting"],
      certificates: [
        { title: "Basic Synoptic Meteorology Certificate", issuer: "IMD Training School, Pune", year: 2024 }
      ],
      createdAt: "2026-01-15T00:00:00.000Z"
    },
    {
      id: "usr-trainee-02",
      name: "Priya Nair",
      email: "priya.nair@moes.gov.in",
      password: hashedPassword,
      role: "trainee",
      status: "approved",
      organization: "Indian National Centre for Ocean Information Services (INCOIS)",
      department: "Ocean Observation & Modeling",
      designation: "Project Scientist 'B'",
      phone: "+91 91234 56789",
      skills: ["Ocean Gliders", "Satellite Sea Surface Temperature", "MATLAB", "GIS"],
      qualifications: "M.Tech Ocean Technology (CUSAT)",
      experience: "2 years in Moored Buoys and Marine Data Telemetry",
      interests: ["Air-Sea Interaction", "Tropical Cyclones", "Marine Heatwaves"],
      certificates: [
        { title: "Marine Weather Observation Course", issuer: "INCOIS / WMO", year: 2025 }
      ],
      createdAt: "2026-01-20T00:00:00.000Z"
    },
    {
      id: "usr-trainee-03",
      name: "Karan Singh",
      email: "karan.singh@imd.gov.in",
      password: hashedPassword,
      role: "trainee",
      status: "pending",
      organization: "IMD Meteorological Centre, Jaipur",
      department: "Agromet Advisory Unit",
      designation: "Technical Officer",
      phone: "+91 97890 12345",
      skills: ["Agro-meteorology", "Field Observations"],
      qualifications: "B.Sc. Agriculture, M.Sc. Agronomy",
      experience: "1 year in district agromet units",
      interests: ["Crop Weather Calendars", "Drought Monitoring"],
      certificates: [],
      createdAt: "2026-02-01T00:00:00.000Z"
    }
  ];

  const courses = [
    {
      id: "crs-001",
      title: "Advanced Doppler Weather Radar (DWR) Operations & Echo Analysis",
      category: "Radar Meteorology",
      trainerId: "usr-trainer-01",
      trainerName: "Dr. Sunitha Sharma",
      duration: "6 Weeks",
      level: "Intermediate",
      description: "Master real-time radar echoes, radial velocity, spectral width, dual-polarization parameters (ZDR, CC, KDP), and severe convective storm tracking using India's C-band and S-band radar networks.",
      thumbnail: "https://images.unsplash.com/photo-1590055531615-f16d36ffe8ec?auto=format&fit=crop&w=800&q=80",
      status: "published",
      enrolledCount: 24,
      rating: 4.8,
      modules: [
        {
          id: "mod-101",
          title: "Module 1: Principles of Meteorological Radars & Hardware Architecture",
          duration: "45 mins",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Comprehensive overview of pulse radar, Doppler dilemma, Nyquist velocity, and receiver calibration in IMD's S-band systems.",
          resources: [
            { name: "DWR_Hardware_Architecture_v3.pdf", type: "pdf", size: "3.4 MB" },
            { name: "S-Band_vs_C-Band_Comparison.pptx", type: "presentation", size: "6.1 MB" }
          ]
        },
        {
          id: "mod-102",
          title: "Module 2: Reflectivity (Z) & Hydrometeor Echo Classification",
          duration: "60 mins",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Learn how to differentiate ground clutter, anomalous propagation, bird echoes, stratiform rain bands, and convective storm cores using PPI and RHI scans.",
          resources: [
            { name: "Echo_Identification_Handbook.pdf", type: "pdf", size: "4.8 MB" }
          ]
        },
        {
          id: "mod-103",
          title: "Module 3: Dual-Polarization Metrics & Mesocyclone Signatures",
          duration: "55 mins",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "In-depth study of Differential Reflectivity (ZDR), Correlation Coefficient (CC), and Specific Differential Phase (KDP) for hail detection and tornado vortex signatures.",
          resources: [
            { name: "Dual_Pol_Convective_Signatures.pdf", type: "pdf", size: "5.2 MB" }
          ]
        }
      ],
      createdAt: "2026-01-12T00:00:00.000Z"
    },
    {
      id: "crs-002",
      title: "Numerical Weather Prediction (NWP) & High-Resolution Regional Modeling",
      category: "Atmospheric Modeling",
      trainerId: "usr-trainer-02",
      trainerName: "Prof. Rajesh K. Varma",
      duration: "8 Weeks",
      level: "Advanced",
      description: "Hands-on foundation in dynamic equations, parameterization of cloud physics, boundary layer dynamics, WRF (Weather Research and Forecasting) setup, and multi-model ensemble evaluation.",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      status: "published",
      enrolledCount: 31,
      rating: 4.9,
      modules: [
        {
          id: "mod-201",
          title: "Module 1: Governing Equations of Atmospheric Motion",
          duration: "50 mins",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Derivation of primitive equations, hydrostatic approximation, continuity, and thermodynamic energy equations.",
          resources: [
            { name: "Primitive_Equations_Notes.pdf", type: "pdf", size: "2.8 MB" }
          ]
        },
        {
          id: "mod-202",
          title: "Module 2: WRF Domain Configuration & Boundary Conditions",
          duration: "75 mins",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Step-by-step setup of geogrid, ungrib, and metgrid utilities for high-resolution 3km Indian subcontinent domain.",
          resources: [
            { name: "WRF_Namelist_Guide.zip", type: "archive", size: "1.2 MB" }
          ]
        }
      ],
      createdAt: "2026-01-18T00:00:00.000Z"
    },
    {
      id: "crs-003",
      title: "Tropical Cyclone Early Warning Systems & Track Prediction",
      category: "Disaster Risk Reduction",
      trainerId: "usr-trainer-01",
      trainerName: "Dr. Sunitha Sharma",
      duration: "4 Weeks",
      level: "All Levels",
      description: "Standard operating procedures (SOP) for monitoring North Indian Ocean cyclogenesis, Dvorak technique, cone of uncertainty calculation, storm surge modeling, and emergency dissemination.",
      thumbnail: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=800&q=80",
      status: "published",
      enrolledCount: 42,
      rating: 4.7,
      modules: [
        {
          id: "mod-301",
          title: "Module 1: Cyclogenesis over Bay of Bengal and Arabian Sea",
          duration: "40 mins",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Sea surface temperatures, vertical wind shear thresholds, and Madden-Julian Oscillation influence.",
          resources: [
            { name: "Cyclogenesis_Climatology.pdf", type: "pdf", size: "4.1 MB" }
          ]
        },
        {
          id: "mod-302",
          title: "Module 2: Enhanced Dvorak Technique (EDT) & Satellite Analysis",
          duration: "60 mins",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Curved band patterns, eye temperature contrasts, and central dense overcast (CDO) estimation.",
          resources: [
            { name: "Dvorak_Classification_Chart.pdf", type: "pdf", size: "3.5 MB" }
          ]
        }
      ],
      createdAt: "2026-01-25T00:00:00.000Z"
    },
    {
      id: "crs-004",
      title: "Agro-Meteorological Advisory & Satellite Crop Monitoring",
      category: "Agricultural Meteorology",
      trainerId: "usr-trainer-02",
      trainerName: "Prof. Rajesh K. Varma",
      duration: "5 Weeks",
      level: "Beginner",
      description: "Generation of block-level weather forecasts, crop stage impact matrices, NDVI analysis, and district agromet bulletin formulation under Gramin Krishi Mausam Sewa (GKMS).",
      thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      status: "published",
      enrolledCount: 18,
      rating: 4.6,
      modules: [
        {
          id: "mod-401",
          title: "Module 1: GKMS Framework and Soil Moisture Estimation",
          duration: "45 mins",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content: "Integration of AWS observations with water balance models for localized advisory.",
          resources: [
            { name: "GKMS_Operational_Handbook.pdf", type: "pdf", size: "3.2 MB" }
          ]
        }
      ],
      createdAt: "2026-02-05T00:00:00.000Z"
    }
  ];

  const enrollments = [
    {
      id: "enr-001",
      userId: "usr-trainee-01",
      courseId: "crs-001",
      enrolledAt: "2026-01-20T10:00:00.000Z",
      completedModules: ["mod-101", "mod-102"],
      progressPercentage: 66,
      status: "in-progress"
    },
    {
      id: "enr-002",
      userId: "usr-trainee-01",
      courseId: "crs-003",
      enrolledAt: "2026-01-26T14:30:00.000Z",
      completedModules: ["mod-301", "mod-302"],
      progressPercentage: 100,
      status: "completed",
      certificateId: "CERT-IMD-2026-90812"
    },
    {
      id: "enr-003",
      userId: "usr-trainee-02",
      courseId: "crs-001",
      enrolledAt: "2026-02-01T09:15:00.000Z",
      completedModules: ["mod-101"],
      progressPercentage: 33,
      status: "in-progress"
    },
    {
      id: "enr-004",
      userId: "usr-trainee-02",
      courseId: "crs-002",
      enrolledAt: "2026-02-05T11:00:00.000Z",
      completedModules: [],
      progressPercentage: 0,
      status: "in-progress"
    }
  ];

  const assessments = [
    {
      id: "asm-001",
      courseId: "crs-001",
      courseTitle: "Advanced Doppler Weather Radar (DWR) Operations & Echo Analysis",
      title: "Technical Qualification Exam: Radar Echo Analysis & Hydrometeor Identification",
      trainerId: "usr-trainer-01",
      durationMinutes: 20,
      passingPercentage: 70,
      deadline: "2026-09-30T23:59:59.000Z",
      totalMarks: 50,
      questions: [
        {
          id: "q1",
          question: "Which dual-polarization radar parameter is most effective for distinguishing between rain and hailstones?",
          options: [
            "Reflectivity Factor (Z) only",
            "Differential Reflectivity (ZDR) combined with high Reflectivity (Z)",
            "Spectral Width (W) solely",
            "Nyquist Velocity limit"
          ],
          correctOptionIndex: 1,
          marks: 10,
          explanation: "Hail causes tumbling, yielding ZDR values near 0 dB even in regions of very high Z (> 55 dBZ), providing a distinctive signature compared to large raindrops which flatten (positive ZDR)."
        },
        {
          id: "q2",
          question: "What is the primary physical constraint described by the 'Doppler Dilemma' in pulse radar operations?",
          options: [
            "The trade-off between maximum unambiguous range (Rmax) and maximum unambiguous velocity (Vmax)",
            "The trade-off between transmitter frequency and antenna diameter",
            "The loss of signal attenuation in foggy conditions",
            "The difficulty in converting Celsius to Kelvin"
          ],
          correctOptionIndex: 0,
          marks: 10,
          explanation: "Rmax * Vmax = c * lambda / 8; increasing unambiguous range requires lowering Pulse Repetition Frequency (PRF), which directly decreases the maximum measurable radial velocity without aliasing."
        },
        {
          id: "q3",
          question: "Anomalous Propagation (AP) in radar echoes occurs predominantly under which atmospheric condition?",
          options: [
            "Strong sub-refraction caused by dry lapse rate",
            "Super-refraction or ducting caused by sharp temperature inversion and moisture decrease with height",
            "Severe cyclonic vortex above 500 hPa",
            "Heavy snowfall at ground level"
          ],
          correctOptionIndex: 1,
          marks: 10,
          explanation: "Temperature inversions with steep humidity declines cause radar beams to bend downward towards the Earth's surface, creating false ground clutter returns known as AP."
        },
        {
          id: "q4",
          question: "What does a Correlation Coefficient (CC or rho_hv) significantly less than 0.8 typically indicate in a radar volume scan?",
          options: [
            "Uniform stratiform rainfall",
            "Non-meteorological targets such as birds, insects, smoke, or ground clutter",
            "Monsoon squall line with pure water drops",
            "High concentration of small spherical cloud droplets"
          ],
          correctOptionIndex: 1,
          marks: 10,
          explanation: "Pure hydrometeors (rain, snow) show high CC (> 0.95). Non-meteorological scatterers like biological scatterers or debris have irregular shapes and diverse orientations, dropping CC well below 0.8."
        },
        {
          id: "q5",
          question: "Which scanning strategy provides a full vertical cross-section of a thunderstorm cell at a fixed azimuth?",
          options: [
            "Plan Position Indicator (PPI)",
            "Range Height Indicator (RHI)",
            "Constant Altitude Plan Position Indicator (CAPPI)",
            "Velocity Azimuth Display (VAD)"
          ],
          correctOptionIndex: 1,
          marks: 10,
          explanation: "RHI scans rotate the antenna vertically at a constant azimuth angle, producing an elevation-versus-range vertical slice through the storm cell."
        }
      ],
      createdAt: "2026-01-22T00:00:00.000Z"
    },
    {
      id: "asm-002",
      courseId: "crs-003",
      courseTitle: "Tropical Cyclone Early Warning Systems & Track Prediction",
      title: "Operational Assessment: Cyclone Intensity Estimation & 4-Stage Warning Protocol",
      trainerId: "usr-trainer-01",
      durationMinutes: 15,
      passingPercentage: 60,
      deadline: "2026-10-15T23:59:59.000Z",
      totalMarks: 30,
      questions: [
        {
          id: "q1",
          question: "Under the IMD Cyclone Warning standard protocol, the 'Cyclone Alert' (Yellow Message) is issued how many hours prior to expected landfall?",
          options: [
            "72 hours in advance",
            "48 hours in advance",
            "24 hours in advance",
            "12 hours in advance"
          ],
          correctOptionIndex: 1,
          marks: 10,
          explanation: "Stage 2 'Cyclone Alert' is issued at least 48 hours in advance of expected commencement of adverse weather in coastal areas."
        },
        {
          id: "q2",
          question: "What is the minimum sustained 3-minute wind speed threshold to classify a North Indian Ocean storm as a 'Very Severe Cyclonic Storm' (VSCS)?",
          options: [
            "34 knots (62 km/h)",
            "48 knots (89 km/h)",
            "64 knots (118 km/h)",
            "90 knots (166 km/h)"
          ],
          correctOptionIndex: 2,
          marks: 10,
          explanation: "IMD classifies cyclonic disturbances with maximum sustained winds of 64-89 knots (118-166 km/h) as Very Severe Cyclonic Storms."
        },
        {
          id: "q3",
          question: "In the Dvorak Tropical Cyclone analysis technique, what does the T-number directly quantify?",
          options: [
            "Tropical Cyclone surface central pressure and maximum sustained wind intensity estimate",
            "Radius of maximum storm surge in meters",
            "Speed of translational movement of the storm centre",
            "Total cumulative rainfall in 24 hours"
          ],
          correctOptionIndex: 0,
          marks: 10,
          explanation: "The Dvorak T-number scales from T1.0 to T8.0, calibrated empirically to estimate current cyclone intensity and minimum central pressure."
        }
      ],
      createdAt: "2026-01-28T00:00:00.000Z"
    }
  ];

  const submissions = [
    {
      id: "sub-001",
      assessmentId: "asm-002",
      courseId: "crs-003",
      userId: "usr-trainee-01",
      traineeName: "Amit Sengupta",
      score: 30,
      totalMarks: 30,
      percentage: 100,
      passed: true,
      submittedAt: "2026-02-02T16:45:00.000Z",
      answers: { q1: 1, q2: 2, q3: 0 }
    }
  ];

  const trainerLibrary = [
    {
      id: "lib-001",
      title: "IMD Standard Operating Procedure (SOP) for Cyclone Operations 2026",
      category: "Manuals & Guidelines",
      uploadedBy: "usr-trainer-01",
      uploaderName: "Dr. Sunitha Sharma",
      fileType: "PDF",
      fileSize: "8.6 MB",
      downloadUrl: "#",
      description: "Official MoES/IMD operational instructions for monitoring and warning services for cyclones over the North Indian Ocean.",
      downloads: 142,
      createdAt: "2026-01-14T00:00:00.000Z"
    },
    {
      id: "lib-002",
      title: "Doppler Weather Radar Interpretation Guide for Operational Forecasters",
      category: "Training Slides",
      uploadedBy: "usr-trainer-01",
      uploaderName: "Dr. Sunitha Sharma",
      fileType: "PPTX",
      fileSize: "14.2 MB",
      downloadUrl: "#",
      description: "Comprehensive slide deck with 200+ annotated real radar scans showing squall lines, tornadic vortexes, and dust storms.",
      downloads: 215,
      createdAt: "2026-01-20T00:00:00.000Z"
    },
    {
      id: "lib-003",
      title: "High-Resolution WRF Atmospheric Modeling Setup Scripts & Configuration",
      category: "Code & Datasets",
      uploadedBy: "usr-trainer-02",
      uploaderName: "Prof. Rajesh K. Varma",
      fileType: "ZIP",
      fileSize: "4.8 MB",
      downloadUrl: "#",
      description: "Bash scripts and namelist.input parameters optimized for Indian monsoon domain simulation on PARAM supercomputers.",
      downloads: 89,
      createdAt: "2026-01-25T00:00:00.000Z"
    },
    {
      id: "lib-004",
      title: "Indian Ocean Marine Buoy Telemetry and AWS Calibration Standards",
      category: "Technical Standards",
      uploadedBy: "usr-trainer-02",
      uploaderName: "Prof. Rajesh K. Varma",
      fileType: "PDF",
      fileSize: "3.1 MB",
      downloadUrl: "#",
      description: "Quality control algorithms and sensor calibration benchmarks for moored buoys and automatic weather stations.",
      downloads: 73,
      createdAt: "2026-02-03T00:00:00.000Z"
    }
  ];

  const announcements = [
    {
      id: "anc-001",
      title: "National Monsoon Mission Capacity Building Workshop 2026 Announced",
      content: "All regional meteorological offices and scientific assistants are invited to apply for the upcoming 2-week advanced training workshop at IMD Pune RTC.",
      category: "Workshop",
      priority: "high",
      authorName: "Dr. M. Mohapatra (Admin)",
      publishedAt: "2026-02-10T10:00:00.000Z",
      active: true
    },
    {
      id: "anc-002",
      title: "New Dual-Pol Radar Data Quality Control Module Published",
      content: "Dr. Sunitha Sharma has uploaded a new module and assessment on Dual-Polarization radar metrics. Enrolled trainees are encouraged to complete the quiz before the deadline.",
      category: "Course Update",
      priority: "medium",
      authorName: "Dr. M. Mohapatra (Admin)",
      publishedAt: "2026-02-12T14:30:00.000Z",
      active: true
    },
    {
      id: "anc-003",
      title: "MoES Competency Framework 2026: Mandatory Annual Certifications",
      content: "Pursuant to ministry guidelines, all technical cadre officers must maintain valid competency certifications in radar, synoptic forecasting, or NWP modeling.",
      category: "Policy",
      priority: "high",
      authorName: "Dr. M. Mohapatra (Admin)",
      publishedAt: "2026-02-15T09:00:00.000Z",
      active: true
    }
  ];

  const feedbacks = [
    {
      id: "fb-001",
      courseId: "crs-001",
      userId: "usr-trainee-01",
      userName: "Amit Sengupta",
      rating: 5,
      comment: "Outstanding explanation of Dual-Pol metrics. The real radar case studies from Chennai and Kolkata radars made complex concepts intuitive.",
      createdAt: "2026-02-04T12:00:00.000Z"
    },
    {
      id: "fb-002",
      courseId: "crs-003",
      userId: "usr-trainee-01",
      userName: "Amit Sengupta",
      rating: 5,
      comment: "Clear and highly operational. The 4-stage cyclone warning protocol flowcharts are directly useful for coastal station shifts.",
      createdAt: "2026-02-03T18:30:00.000Z"
    }
  ];

  return {
    users,
    courses,
    enrollments,
    assessments,
    submissions,
    trainerLibrary,
    announcements,
    feedbacks
  };
};
