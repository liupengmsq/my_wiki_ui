import { get } from '../utils/request';

export const isBlogCategoryId = async (categoryId) => {
    let response = await get('/wiki/category/blog');
    if (!response.Success) {
      console.error("Error when calling API '/wiki/category/blog'!!", response.Errors);
    }
    return categoryId === response.Result.id;
}