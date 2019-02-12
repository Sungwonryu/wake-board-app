import { Message } from './message.model';

export class MessageService  {
  list: Message[] = [
    { id: '1', message: 'See Port Captain', symbol: '?', abbreviation: 'PC' },
    { id: '2', message: 'See Human Resources', symbol: '!', abbreviation: 'HR' },
    { id: '3', message: 'Report to Pier 11', symbol: '*', abbreviation: '11' },
    { id: '4', message: 'Training Assignment', symbol: '^', abbreviation: 'T' }
  ];

  constructor() { }

}
