export interface Settlement {
    from: string;
    to: string;
    amount: number;
  }
  
  export function calculateSettlements(
    members: { id: string; name: string}[],
    expenses: { amount: number | string; payer_id: string }[]
  ): Settlement[] {
    if (!members.length || !expenses.length) return [];
  
    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const fairShare = totalSpent / members.length;
  
    // Calculate net balance for each member
    const balances: Record<string, number> = {};
    members.forEach((m) => (balances[m.id] = -fairShare));
    expenses.forEach((exp) => {
      balances[exp.payer_id] = (balances[exp.payer_id] || 0) + Number(exp.amount);
    });
  
    // Separate debtors (< 0) and creditors (> 0)
    const debtors: { name: string; amount: number }[] = [];
    const creditors: { name: string; amount: number }[] = [];
  
    members.forEach((m) => {
      const bal = balances[m.id];
      if (bal < -0.01) debtors.push({ name: m.name, amount: -bal });
      else if (bal > 0.01) creditors.push({ name: m.name, amount: bal });
    });
  
    // Match debtors to creditors
    const settlements: Settlement[] = [];
    let i = 0;
    let j = 0;
  
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const transferAmount = Math.min(debtor.amount, creditor.amount);
  
      if (transferAmount > 0.01) {
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: Number(transferAmount.toFixed(2)),
        });
      }
  
      debtor.amount -= transferAmount;
      creditor.amount -= transferAmount;
  
      if (debtor.amount <= 0.01) i++;
      if (creditor.amount <= 0.01) j++;
    }
  
    return settlements;
  }