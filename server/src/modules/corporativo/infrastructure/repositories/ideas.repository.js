import Ideas from '#modules/corporativo/infrastructure/mongoose/models/ideas.model.js';

export const IdeasRepository = {
  async findAll() {
    return Ideas.find().lean();
  },
};

export default IdeasRepository;


