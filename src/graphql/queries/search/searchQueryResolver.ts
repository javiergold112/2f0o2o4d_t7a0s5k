import { searchController } from "../../../controllers";

interface ArgumentType {
  search: string;
}

export const searchQueryResolver = {
  search: async (parent: any, args: ArgumentType, context: any, info: any) => {
    const { search } = args;

    try {
      const result = await searchController(search);

      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
