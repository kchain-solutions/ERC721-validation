import { NewERC721Validator as NewERC721ValidatorEvent } from "../generated/ERC721ValidatorFactory/ERC721ValidatorFactory"
import { NewERC721Validator, Validation } from "../generated/schema"
import { ERC721Validator } from "../generated/templates"
import { Validation as ValidationEvent } from "../generated/templates/ERC721Validator/ERC721Validator";

export function handleNewERC721Validator(event: NewERC721ValidatorEvent): void {
    let entity = new NewERC721Validator(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    ERC721Validator.create(event.params.validatorAddr);
    entity.validatorId = event.params.validatorId;
    entity.ownerAddr = event.params.ownerAddr;
    entity.validatorAddr = event.params.validatorAddr;
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save();
}

export function handleValidation(event: ValidationEvent): void {
    let entity = new Validation(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.validatorAddr = event.params.validatorAddr;
    entity.validatorId = event.params.validatorId;
    entity.nftAddr = event.params.nftAddr;
    entity.userAddr = event.params.userAddr;
    entity.verificationHash = event.params.verificationHash;
    entity.result = event.params.result;
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save();
}