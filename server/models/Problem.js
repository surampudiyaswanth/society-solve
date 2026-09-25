import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
  {
    problemId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a problem title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a societal problem category'],
      enum: [
        'Education',
        'Healthcare',
        'Environment',
        'Transportation',
        'Public Safety',
        'Water & Sanitation',
        'Infrastructure',
        'Governance & Services',
        'Economic Opportunity',
        'Employment',
        'Agriculture',
      ],
    },
    problemType: {
      type: String,
      required: [true, 'Please specify the problem type'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description of the problem'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide the street or neighborhood location'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please specify the city'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please specify the state'],
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
      default: '',
    },
    // Dedicated numeric coordinate storage
    coordinates: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },
    // Standard GeoJSON Point for MongoDB $near & spatial queries
    geoPoint: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    peopleAffected: {
      type: Number,
      default: 10,
      min: [1, 'Number of people affected must be at least 1'],
    },
    dateObserved: {
      type: Date,
      default: Date.now,
    },
    images: {
      type: [String],
      default: [],
    },
    documents: {
      type: [String],
      default: [],
    },
    videoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    additionalComments: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'Submitted',
        'Under Review',
        'Accepted',
        'University Assigned',
        'Solution Development',
        'Industry Collaboration',
        'Pilot Implementation',
        'Implemented',
        'Impact Measured',
        'Resolved',
      ],
      default: 'Submitted',
    },
    assignedUniversity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UniversityProfile',
      default: null,
    },
    industryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IndustryProfile',
      default: null,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 10, // Initial submission progress
    },
    timeline: [
      {
        status: {
          type: String,
          required: true,
        },
        updatedBy: {
          type: String,
          default: 'System',
        },
        note: {
          type: String,
          default: '',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for radius, proximity, and map boundary search queries
problemSchema.index({ geoPoint: '2dsphere' });

// Pre-save hook to initialize timeline and sync coordinates to geoPoint
problemSchema.pre('save', function (next) {
  // Sync numeric coordinates to GeoJSON Point array [lon, lat]
  if (
    this.coordinates &&
    this.coordinates.latitude != null &&
    this.coordinates.longitude != null
  ) {
    this.geoPoint = {
      type: 'Point',
      coordinates: [
        Number(this.coordinates.longitude),
        Number(this.coordinates.latitude),
      ],
    };
  }

  // Initialize initial timeline entry if new
  if (this.isNew && (!this.timeline || this.timeline.length === 0)) {
    this.timeline = [
      {
        status: 'Submitted',
        updatedBy: 'Citizen Reporter',
        note: 'Problem successfully logged on SocietySolve ecosystem.',
        timestamp: new Date(),
      },
    ];
  }
  next();
});

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;