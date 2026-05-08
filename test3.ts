import { PROGRAM_DAYS } from './src/data/rawProgramContent.ts';
import { programDays } from './src/data/programDays.ts';
console.log('Day 10 raw:', PROGRAM_DAYS[7]);
console.log('Day 10 parsed:', programDays.find(d => d.dayNumber === 10));
