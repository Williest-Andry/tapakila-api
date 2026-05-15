import { EventCategory } from "../../../generated/prisma/client.js";
import {
  CreateEventCategoryDto,
  EventCategoryResponseDto,
} from "./category.dto.js";
import * as categoryRepository from "./category.repository.js";

function toCategoryResponse(
  eventCategory: EventCategory,
): EventCategoryResponseDto {
  const responseEventCategory: EventCategoryResponseDto = {
    id: eventCategory.id,
    name: eventCategory.name,
    slug: eventCategory.slug,
  };

  return responseEventCategory;
}

export async function findAll(
  page?: number,
  limit?: number,
): Promise<EventCategoryResponseDto[]> {
  const eventCategories = await categoryRepository.findAll(page, limit);

  const responseEventCategories = eventCategories.map(toCategoryResponse);

  return responseEventCategories;
}

export async function create(
  categoryDto: CreateEventCategoryDto,
): Promise<EventCategoryResponseDto> {
  const slug = categoryDto.name.split(" ").join("-").toLocaleLowerCase();

  const eventCategory = {
    name: categoryDto.name,
    slug: slug,
  };

  const createdEventCategory = await categoryRepository.create(eventCategory);

  return toCategoryResponse(createdEventCategory);
}
