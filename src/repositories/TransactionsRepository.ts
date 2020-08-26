import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions
      .filter(transaction => transaction.type === 'income')
      .map(incomeTransaction => incomeTransaction.value)
      .reduce(
        (incomeTotal, incomeTransaction) => (incomeTotal += incomeTransaction),
        0,
      );

    const outcome = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .map(outcomeTransaction => outcomeTransaction.value)
      .reduce(
        (outcomeTotal, outcomeTransaction) =>
          (outcomeTotal += outcomeTransaction),
        0,
      );

    const total = income - outcome;

    const balance = { income, outcome, total };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const balance = this.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw Error('Invalid transaction. Balance can not be negative');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
