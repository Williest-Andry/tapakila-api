import { EventCategory } from "../../generated/prisma/client.js";
import { ConflictError, NotFoundError } from "../../common/errors/index.js";
import {
  CreateEventCategoryDto,
  EventCategoryResponseDto,
} from "./category.dto.js";
import * as categoryRepository from "./category.repository.js";

function toEventCategoryResponse(
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

  const responseEventCategories = eventCategories.map(toEventCategoryResponse);

  return responseEventCategories;
}

export async function findById(id: string): Promise<EventCategoryResponseDto> {
  const eventCategory = await categoryRepository.findById(id);
  if (!eventCategory) throw new NotFoundError(`event category with id : ${id}`);

  return toEventCategoryResponse(eventCategory);
}

export async function findByName(name: string) {
  const eventCategory = await categoryRepository.findByName(name);
  if (!eventCategory)
    throw new NotFoundError(`event category with name : ${name}`);

  return eventCategory;
}

export async function create(
  categoryDto: CreateEventCategoryDto,
): Promise<EventCategoryResponseDto> {
  const existingCategory = await categoryRepository.findByName(
    categoryDto.name,
  );
  if (existingCategory)
    throw new ConflictError(`event category with name : ${categoryDto.name}`);

  const slug = categoryDto.name.split(" ").join("-").toLocaleLowerCase();

  const eventCategory = {
    name: categoryDto.name,
    slug: slug,
  };

  const createdEventCategory = await categoryRepository.create(eventCategory);

  return toEventCategoryResponse(createdEventCategory);
}
