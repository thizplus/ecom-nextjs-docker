const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'text-yellow-500';
    case 'success':
      return 'text-green-500';
    case 'cancelled':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export default getStatusColor
