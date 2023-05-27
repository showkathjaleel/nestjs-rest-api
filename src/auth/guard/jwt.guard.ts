import { Injectable } from "@nestjs/common/decorators";
import {AuthGuard} from '@nestjs/passport'
@Injectable()
//This is a custom Guard that extend AuthGuard from nestjs
export class JwtGuard extends AuthGuard('jwt') {
    constructor(){
        super()
    }

}