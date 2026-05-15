import { EventCategory } from "../../../generated/prisma/client.js";
import { CategoryResponseDto } from "./category.dto.js";
import * as categoryRepository from "./category.repository.js";

function toCategoryResponse(eventCategory: EventCategory): CategoryResponseDto {
  const responseCategory: CategoryResponseDto = {
    id: eventCategory.id,
    name: eventCategory.name,
    slug: eventCategory.slug,
  };

  return responseCategory;
}

export async function findAll(
  page?: number,
  limit?: number,
): Promise<CategoryResponseDto[]> {
  const categories = await categoryRepository.findAll(page, limit);

  const responseCategories = categories.map(toCategoryResponse);

  return responseCategories;
}
