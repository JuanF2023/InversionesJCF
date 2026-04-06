// server/src/modules/corporativo/infrastructure/repositories/ideas.repository.js
import { Idea } from "#modules/corporativo/infrastructure/repositories/../orm/idea.model.js";

export class IdeasRepository {
    async findAll() {
        return Idea.find({}).sort({ createdAt: -1 }).lean();
    }
}

