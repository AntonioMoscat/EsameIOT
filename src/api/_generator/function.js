export default function FunctionGeneration(Entity) {
  const notFoundMessage = { message: 'No element Found' };
  const noModificationMessage = { message: 'No elements found to modify' };
  const deleteSuccessMessage = { message: 'Delete successfully' };

  // Funzione di utilità per gestire gli errori
  const handleError = (res, err, statusCode = 500) => {
    logger.error(err.message);
    return res.status(statusCode).send({ message: err.message });
  };

  // Funzione di utilità per gestire i risultati
  const handleResult = (res, result) => {
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return res.status(404).send(notFoundMessage);
    }
    return res.status(200).send(result);
  };

  async function index({ querymen: { query, select, cursor }, userId }, res) {
    try {
      const result = await Entity.find({ ...query, userId }, select, cursor);
      return handleResult(res, result);
    } catch (err) {
      return handleError(res, err);
    }
  }

  async function show({ querymen: { query, select, cursor }, params, userId }, res) {
    try {
      const result = await Entity.findOne({ ...query, userId, _id: params.id }, select, cursor);
      return handleResult(res, result);
    } catch (err) {
      return handleError(res, err);
    }
  }

  async function showMe({ userId }, res) {
    try {
      const result = await Entity.findOne({ _id: userId });
      return handleResult(res, result);
    } catch (err) {
      return handleError(res, err);
    }
  }

  async function create({ body, userId }, res) {
    try {
      const created = await Entity.create({ ...body, userId });
      return res.status(201).send(created);
    } catch (err) {
      return handleError(res, err, 400);
    }
  }

  async function update({ body, userId, params }, res) {
    try {
      let updatedItem = await Entity.findOne({ _id: params.id, userId });

      if (!updatedItem) {
        return res.status(404).send(noModificationMessage);
      }
      for (let val in body) {
        updatedItem[val] = body[val];
      }
      await updatedItem.save();
      return res.status(200).send(updatedItem);
    } catch (err) {
      return handleError(res, err, 400);
    }
  }


  async function updateMe({ body, userId }, res) {
    try {
      let result = await Entity.findOne({ _id: userId });

      if (!result) {
        return res.status(404).send(noModificationMessage);
      }

      for (let val in body) {
        result[val] = body[val];
      }
      await result.save();
      return res.status(200).send(result);
    } catch (err) {
      return handleError(res, err, 400);
    }
  }

  async function destroy({ userId, params }, res) {
    try {
      const { deletedCount } = await Entity.deleteOne({ _id: params.id, userId });
      if (deletedCount === 0) {
        return res.status(404).send({ message: 'No elements found to delete' });
      }
      return res.status(200).send(deleteSuccessMessage);
    } catch (err) {
      return handleError(res, err, 400);
    }
  }

  async function destroyMe({ userId }, res) {
    try {
      const { deletedCount } = await Entity.deleteOne({ _id: userId });
      if (deletedCount === 0) {
        return res.status(404).send({ message: 'No elements found to delete' });
      }
      return res.status(200).send(deleteSuccessMessage);
    } catch (err) {
      return handleError(res, err, 400);
    }
  }

  return {
    index,
    show,
    showMe,
    create,
    update,
    updateMe,
    destroy,
    destroyMe
  };
};