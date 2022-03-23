import { reflector } from '@app/constants/reflector.constant'
import { SetMetadata } from '@nestjs/common'
import * as META from '@app/constants/meta.constant'

interface ResponsorOptions {
    isApi?: boolean
}

export const getResponsorOptions = (target: any): ResponsorOptions => {
    return {
      isApi: reflector.get(META.HTTP_API, target),
    }
}

export interface DecoratorCreatorOption {
    useApi: boolean
}

const createDecorator = (options: DecoratorCreatorOption): MethodDecorator => {
    const { useApi } = options
    return (_, __, descriptor: PropertyDescriptor) => {
      if (useApi) {
        SetMetadata(META.HTTP_API, true)(descriptor.value)
      }
      return descriptor
    }
}

export const api = (): MethodDecorator => {
    return createDecorator({ useApi: true })
}

export const Responsor = { api }
