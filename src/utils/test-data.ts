function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(',', '');
}

export const TestData = {
  validOneWay: {
    from: 'Sydney',
    fromCode: 'SYD',
    to: 'Melbourne',
    toCode: 'MEL',
    departDate: formatDate(addDays(1)),
    returnDate: formatDate(addDays(7)),

  },
  validRoundTrip: {
    from: 'Sydney',
    fromCode: 'SYD',
    to: 'Brisbane',
    toCode: 'BNE',
    departDate: formatDate(addDays(30)),
    returnDate: formatDate(addDays(37)),
  },
  sameOriginAndDestination: {
    from: 'Sydney',
    to: 'Sydney',
  },
  nonExistentPlace: {
    from: 'Sydney',
    to: 'Zzzzznotarealcityxyz',
  },
  emptyDestination: {
    from: 'Sydney',
    to: '',
  },
};