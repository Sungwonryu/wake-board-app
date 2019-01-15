import { Message } from './message.model';

export class MessageService  {
  list: Message[] = [
    { message: 'See Port Captain', symbol: '?', abbreviation: 'PC' },
    { message: 'See Human Resources', symbol: '!', abbreviation: 'HR' },
    { message: 'Report to Pier 11', symbol: '*', abbreviation: '11' },
    { message: 'Training Assignment', symbol: '^', abbreviation: 'T' }
  ];

  constructor() { }

}
