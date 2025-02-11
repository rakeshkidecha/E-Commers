const Category = require('../models/CategoryModel');
const SubCategory = require('../models/SubCategoryModel');
const ExtraCategory = require('../models/ExtraCategoryModel');
const Type = require('../models/TypeModel');
const Brand = require('../models/BrandModel');
const Product = require('../models/ProductModel');
const path = require('path');
const fs = require('fs');

async function changeSubCatStatusBaseOnCat(subCategoryIds){
    const allSubCategory = await SubCategory.find({_id:{$in:subCategoryIds}});
    await SubCategory.updateMany({_id:{$in:subCategoryIds}},{status:false});
    allSubCategory.map(async (item)=>{
        deactiveExCatBsOnSubCat(item.extraCategoryIds);
    });
};


async function deleteSubCatBaseOnCat(subCategoryIds){
    const allSubCategory = await SubCategory.find({_id:{$in:subCategoryIds}});
    await SubCategory.deleteMany({_id:{$in:subCategoryIds}});
    allSubCategory.map(async (item)=>{
        deleteExCatBsOnSubCat(item.extraCategoryIds);
    });
};

async function deactiveExCatBsOnSubCat(extraCategoryIds) {
    const allExtraCategory = await ExtraCategory.find({_id:extraCategoryIds});
    await ExtraCategory.updateMany({_id:{$in:extraCategoryIds}},{status:false});
    allExtraCategory.map((item)=>{
        deativeTypeBsOnExCat(item.typeIds);
        deativeBrandBsOnExCat(item.brandIds);
    })
}

async function deleteExCatBsOnSubCat(extraCategoryIds) {
    const allExtraCategory = await ExtraCategory.find({_id:extraCategoryIds});
    await ExtraCategory.deleteMany({_id:{$in:extraCategoryIds}});
    allExtraCategory.map((item)=>{
        deleteTypeBsOnExCat(item.typeIds);
        deleteBrandBsOnExCat(item.brandIds);
    });
}

async function deativeTypeBsOnExCat(typeIds) {
    const allSelectedType = await Type.find({_id:{$in:typeIds}});
    await Type.updateMany({_id:{$in:typeIds}},{status:false});
    allSelectedType.map(async(item)=>{
        deactiveProBsOnTypeOrBrand(item.productIds);
    });
};

async function deleteTypeBsOnExCat(typeIds) {
    const allSelectedType = await Type.find({_id:{$in:typeIds}});
    await Type.deleteMany({_id:{$in:typeIds}});
    allSelectedType.map(async(item)=>{
        deleteProBsOnTypeOrBrand(item.productIds);
    });
};

async function deativeBrandBsOnExCat(brandIds) {
    const allSelectedBrand = await Brand.find({_id:{$in:brandIds}});
    await Brand.updateMany({_id:{$in:brandIds}},{status:false});
    allSelectedBrand.map(async(item)=>{
        deactiveProBsOnTypeOrBrand(item.productIds);
    });
};

async function deleteBrandBsOnExCat(brandIds) {
    const allSelectedBrand = await Brand.find({_id:{$in:brandIds}});
    await Brand.deleteMany({_id:{$in:brandIds}});
    allSelectedBrand.map(async(item)=>{
        deleteProBsOnTypeOrBrand(item.productIds);
    });
};

async function deactiveProBsOnTypeOrBrand(proIds) {
    await Product.updateMany({_id:{$in:proIds}},{status:false});
}

async function deleteProBsOnTypeOrBrand(proIds) {
    const relatateProduct = await Product.find({_id:{$in:proIds}});
    const deletMany = await Product.deleteMany({_id:{$in:proIds}});
    if(deletMany){
        relatateProduct.map(async(item)=>{
            try {
                const deletePath = path.join(__dirname,'..',item.coverImage);
                await fs.unlinkSync(deletePath);
            } catch (err) {
                console.log("Image Not Found");
            };
    
            item.productImages.map(async(item)=>{
                try {
                    const deletePath = path.join(__dirname,'..',item);
                    await fs.unlinkSync(deletePath);
                } catch (err) {
                    console.log("Image not Found")
                }
            });

            // remove product id from type 
            const singleType = await Type.findById(item.typeId);
            if(singleType){
                singleType.productIds.splice(singleType.productIds.indexOf(item._id),1);
                await Type.findByIdAndUpdate(singleType._id,singleType);
            }else{
                console.log("Record not found");
            }

            // remove product id from Brand
            const singleBrand = await Brand.findById(item.brandId);
            if(singleBrand){
                singleBrand.productIds.splice(singleBrand.productIds.indexOf(item._id),1);
                await Brand.findByIdAndUpdate(singleBrand._id,singleBrand);
            }else{
                console.log("Record not Found");
            }
        });
    }
}

exports.opration = {
    changeSubCatStatusBaseOnCat,
    deleteSubCatBaseOnCat,
    deactiveExCatBsOnSubCat,
    deleteExCatBsOnSubCat,
    deativeTypeBsOnExCat,
    deleteTypeBsOnExCat,
    deativeBrandBsOnExCat,
    deleteBrandBsOnExCat,
    deactiveProBsOnTypeOrBrand,
    deleteProBsOnTypeOrBrand
}