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
    const incomeBalance = this.transactions
      .filter(transaction => transaction.type === 'income')
      .map(income => income.value)
      .reduce((total, income) => (total += income), 0);

    const outcomeBalance = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .map(outcome => outcome.value)
      .reduce((total, outcome) => (total += outcome), 0);

    const totalBalance = incomeBalance - outcomeBalance;

    const balance = { incomeBalance, outcomeBalance, totalBalance };

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
