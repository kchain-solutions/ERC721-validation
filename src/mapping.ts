import { NewERC721Validator as NewERC721ValidatorEvent } from "../generated/ERC721ValidatorFactory/ERC721ValidatorFactory"
import { NewERC721Validator } from "../generated/schema"

export function handleNewBlog(event: NewERC721ValidatorEvent): void {
    let entity = new NewERC721Validator(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );

    entity.validatorId = event.params.validatorId;
    entity.ownerAddr = event.params.owner;
    entity.validatorAddr = event.params.validatorAddr;
    entity.save();

}