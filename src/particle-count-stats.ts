export type ParticleCountStats = {
    mean: number,
    stddev: number,
    num: number,
}
export const NO_PARTICLE_COUNT_STATS: ParticleCountStats = {num: 0, mean: 0, stddev: 0};
