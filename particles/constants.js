// ----
// These constants affect the particle motion
export const FRICTION_CONSTANT = 0.8;
export const PARTICLE_MASS = 16;

export const ANGLE_CHANGE_CONSTANT = 0.0001;
// ----
// These constants affect the way the simulation looks visually

// This constant affects the width of the shape that the particles form into
export const SHAPE_SIZE = 300;
export const BASE_HUE = 20;
export const LIGHT_STRIPE_HERTZ = 0.005;

// ----
// This section has to do with the way that particles are generated.

// This is the point at which it swaps from linear to exponential
export const PARTICLE_PHASE_CHANGE_NUMBER_OF_SECONDS = 60;
export const PARTICLES_PER_SECOND_IN_LINEAR_PHASE = 0.4;
export const PARTICLE_SYSTEM_START_TIME = 600;
export const FINAL_NUMBER_OF_PARTICLES = 4500;
