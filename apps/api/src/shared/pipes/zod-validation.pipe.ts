import {
  BadRequestException,
  Injectable,
  type PipeTransform,
} from "@nestjs/common";
import type { ZodType } from "zod";

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const parsed = this.schema.safeParse(value);

    if (!parsed.success) {
      throw new BadRequestException({
        ok: false,
        message: "입력값을 다시 확인해 주세요.",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    return parsed.data;
  }
}
