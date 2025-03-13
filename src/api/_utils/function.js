export function generateHexColor() {
  const hexChars = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += hexChars[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const generateBulkOperations = (data, operation = 'insert') => {
  if (!Array.isArray(data) || _.isEmpty(data)) {
    throw new Error('Data must be a non-empty array');
  }

  const bulkOps = [];

  data.forEach(item => {
    switch (operation) {
      case 'insert':
        bulkOps.push({ insertOne: { document: item } });
        break;
      case 'update':
        if (!item._id) throw new Error('Update operations require _id');
        bulkOps.push({
          updateOne: {
            filter: { _id: item._id },
            update: { $set: item.data },
            upsert: true
          }
        });
        break;
      case 'delete':
        if (!item._id) throw new Error('Delete operations require _id');
        bulkOps.push({ deleteOne: { filter: { _id: item._id } } });
        break;
      default:
        throw new Error('Invalid operation. Use insert , update  or  delete ');
    }
  });

  return bulkOps;
};