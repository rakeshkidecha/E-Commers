const Category = require('../models/CategoryModel');
const SubCategory = require('../models/SubCategoryModel');
const ExtraCategory = require('../models/ExtraCategoryModel');
const Type = require('../models/TypeModel');

async function changeSubCatStatusBaseOnCat(subCategoryIds){
    const allSubCategory = await SubCategory.find({_id:{$in:subCategoryIds}});
    await SubCategory.updateMany({_id:{$in:subCategoryIds}},{status:false});
    allSubCategory.map(async (item)=>{
        deactiveExCatBsOnSubCat(item.extraCategoryIds);
    });
};


async function deleteSubCatBaseOnCat(subCategoryIds){
    const allSubCategory = await SubCategory.find({_id:{$in:subCategoryIds}});
    await SubCategory.deleteMany({_id:{$in:subCategoryIds}},{status:false});
    allSubCategory.map(async (item)=>{
        deleteExCatBsOnSubCat(item.extraCategoryIds);
    });
};

async function deactiveExCatBsOnSubCat(extraCategoryIds) {
    const allExtraCategory = await ExtraCategory.find({_id:extraCategoryIds});
    await ExtraCategory.updateMany({_id:{$in:extraCategoryIds}},{status:false});
    allExtraCategory.map((item)=>{
        deativeTypeBsOnExCat(item.typeIds);
    })
}

async function deleteExCatBsOnSubCat(extraCategoryIds) {
    const allExtraCategory = await ExtraCategory.find({_id:extraCategoryIds});
    await ExtraCategory.deleteMany({_id:{$in:extraCategoryIds}});
    allExtraCategory.map((item)=>{
        deleteTypeBsOnExCat(item.typeIds);
    });
}

async function deativeTypeBsOnExCat(typeIds) {
    await Type.updateMany({_id:{$in:typeIds}},{status:false});
};

async function deleteTypeBsOnExCat(typeIds) {
    await Type.deleteMany({_id:{$in:typeIds}});
};


exports.opration = {
    changeSubCatStatusBaseOnCat,
    deleteSubCatBaseOnCat,
    deactiveExCatBsOnSubCat,
    deleteExCatBsOnSubCat,
    deativeTypeBsOnExCat,
    deleteTypeBsOnExCat,
}