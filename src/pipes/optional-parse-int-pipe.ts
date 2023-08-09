import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class OptionalParseIntPipe
  implements PipeTransform<string, number | undefined>
{
  transform(value: string): number | undefined {
    if (value === undefined) return undefined;
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }
    return val;
  }
}
