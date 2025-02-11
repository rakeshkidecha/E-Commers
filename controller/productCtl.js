const Category = require('../models/CategoryModel');
const SubCategory = require('../models/SubCategoryModel');
const ExtraCategory = require('../models/ExtraCategoryModel');
const Type = require('../models/TypeModel');
const Brand = require('../models/BrandModel');
const Product = require('../models/ProductModel');
const path = require('path');
const fs = require('fs');

module.exports.addProduct = async(req,res)=>{
    try {
        const allCategory = await Category.find({status:true});
        return res.render('product/addProduct',{allCategory});
        
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
};

module.exports.getSubCategory = async(req,res)=>{
    try {
        const allSubCatBaseCat = await SubCategory.find({status:true,categoryId:req.params.catId});
        return res.json(allSubCatBaseCat);
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/product');
    }
};

module.exports.getExtraCategory = async(req,res)=>{
    try {
        const allExCatBaseSubCat = await ExtraCategory.find({status:true,subCategoryId:req.params.subCatId});
        return res.json(allExCatBaseSubCat);
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/product');
    }
};

module.exports.getBrandAndType = async(req,res)=>{
    try {
        const allTypeBsOnExCat = await Type.find({extraCategoryId:req.params.exCatId});
        const allBrandBsOnExCat = await Brand.find({extraCategoryId:req.params.exCatId});
        return res.json({brand:allBrandBsOnExCat,type:allTypeBsOnExCat});

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/product');
    }
};

module.exports.insertProduct = async (req,res)=>{
    try {
        let coverImage = '';
        let productImages = [];
        if(req.files){
            coverImage = Product.imgPath+'/'+req.files.coverImage[0].filename;
            productImages = req.files.productImages.map((item)=>{
                return Product.imgPath+'/'+item.filename
            });
        }

        req.body.coverImage = coverImage;
        req.body.productImages = productImages;

        const addedProduct = await Product.create(req.body);
        if(addedProduct){
            // product id add in type 
            const singleType = await Type.findById(addedProduct.typeId);
            singleType.productIds.push(addedProduct._id);
            await Type.findByIdAndUpdate(singleType._id,singleType);

            // Product id add in brand 
            const singleBrand = await Brand.findById(addedProduct.brandId);
            singleBrand.productIds.push(addedProduct._id);
            await Brand.findByIdAndUpdate(singleBrand._id,singleBrand);

            req.flash('success',"Product Add Successfully");
            console.log("Product Add success fully");
            return res.redirect('/product');
        }else{
            req.flash('error','Faild To Add Product');
            console.log("Failed to Add Product");
            return res.redirect('/product')
        }
        
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/product');
    }
};

module.exports.viewProduct = async(req,res)=>{
    try {
        let searchValue ='';
        let date,sort,sortType;

        if(req.query.searchValue){
            searchValue = req.query.searchValue;
        }
        
        if(req.query.date){
            date = new Date(req.query.date);
        }
        
        if(req.query.sort && req.query.sortType){
            sort = parseInt(req.query.sort);
            sortType = req.query.sortType;
        }

        const allProduct = await Product.find({
            ...(date && {createdAt:{$gte:new Date(new Date(date).setHours(0,0,0,0)),$lte:new Date(new Date(date).setHours(23,59,59,999))}}),
            $or:[
                {title:{$regex:searchValue,$options:'i'}},
            ]
        }).sort({...(sort&&{[sortType]:sort})}).populate('categoryId').populate('subCategoryId').populate('extraCategoryId').populate('typeId').populate('brandId').exec()

        return res.render('product/viewProduct',{
            allProduct,
            searchValue,
            date,
            sort,
            sortType,
        });
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/product');
    }
};

module.exports.changeProductStatus = async(req,res)=>{
    try {
        const {id,status} = req.params;
        const singleProduct = await Product.findById(id).populate('typeId').populate('brandId').exec();

        if(status=='true'){
            if(!singleProduct.typeId.status){
                req.flash('error',"The Product Type is not Active");
                return res.redirect('back');
            }

            if(!singleProduct.brandId.status){
                req.flash('error',"The Product Brand is not Active");
                return res.redirect('back');
            }
        }

        const updateStatus = await Product.findByIdAndUpdate(id,{status:status});
        if(updateStatus){
            req.flash('success',"Product Status Change Successfully");
            return res.redirect('back');
        }else{
            req.flash('error',"Failed to Chnage Product Status");
            return res.redirect('back');
        }
        
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/product');
    }
};

module.exports.deleteProduct = async(req,res)=>{
    try {
        const singleProduct = await Product.findById(req.params.id);
        if(singleProduct){
            // delete image path form uploads foder 
            try {
                const deletePath = path.join(__dirname,'..',singleProduct.coverImage);
                await fs.unlinkSync(deletePath);
            } catch (err) {
                console.log("image not Found");
            }

            singleProduct.productImages.map(async(item)=>{
                try {
                    const deletePath = path.join(__dirname,'..',item);
                    await fs.unlinkSync(deletePath);
                } catch (err) {
                    console.log("image not Found");
                }
            });

            const deletedProduct = await Product.findByIdAndDelete(req.params.id);

            if(deletedProduct){
                // remove product id from type 
                const singleType = await Type.findById(deletedProduct.typeId);
                singleType.productIds.splice(singleType.productIds.indexOf(deletedProduct._id),1);
                await Type.findByIdAndUpdate(singleType._id,singleType);

                // remove product id from brand 
                const singleBrand = await Brand.findById(deletedProduct.brandId);
                singleBrand.productIds.splice(singleBrand.productIds.indexOf(deletedProduct._id),1);
                await Brand.findByIdAndUpdate(singleBrand._id,singleBrand);

                req.flash('success',"Product Deleted Successfully");
                return res.redirect('back');
            }else{
                req.flash('error',"Failed to Delete Product");
                return res.redirect('back');
            }

        }else{
            req.flash('error',"Product Not Found");
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/product');
    }
};

module.exports.updateProduct = async(req,res)=>{
    try {
        const singleProduct = await Product.findById(req.params.id);
        const allCategory = await Category.find({status:true});
        const allSubCatBaseCat = await SubCategory.find({status:true,categoryId:singleProduct.categoryId});
        const allExCatBaseSubCat = await ExtraCategory.find({status:true,subCategoryId:singleProduct.subCategoryId});
        const allTypeBsOnExCat = await Type.find({status:true,extraCategoryId:singleProduct.extraCategoryId});
        const allBrandBsOnExCat = await Brand.find({status:true,extraCategoryId:singleProduct.extraCategoryId});

        return res.render('product/updateProduct',{
            singleProduct,
            allCategory,
            allSubCatBaseCat,
            allExCatBaseSubCat,
            allTypeBsOnExCat,
            allBrandBsOnExCat
        })

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
};

module.exports.editProduct = async(req,res)=>{
    try {
        const singleProduct = await Product.findById(req.body.id);
        
        if(req.files){
            if(req.files.coverImage){
                try {
                    const deletePath = path.join(__dirname,'..',singleProduct.coverImage);
                    await fs.unlinkSync(deletePath);
                } catch (err) {
                    console.log("Image not found");
                }

                req.body.coverImage = Product.imgPath+'/'+req.files.coverImage[0].filename;

            }else{                
                req.body.coverImage = singleProduct.coverImage;
            }

            if(req.files.productImages){
                singleProduct.productImages.map(async(item)=>{
                    try {
                        const deletePath = path.join(__dirname,'..',item);
                        await fs.unlinkSync(deletePath);
                    } catch (err) {
                        console.log("Image not found");
                    }
                });

                req.body.productImages = req.files.productImages.map((item)=>{
                    return Product.imgPath+'/'+item.filename;
                });
            }else{
                req.body.productImages = singleProduct.productImages;
            }

        }else{  
            req.body.coverImage = singleProduct.coverImage;
            req.body.productImages = singleProduct.productImages;
        }

        const prevProduct = await Product.findByIdAndUpdate(req.body.id,req.body);
        if(prevProduct){
            if(prevProduct.typeId != req.body.typeId){
                // remove product id from old type
                const oldType = await Type.findById(prevProduct.typeId);
                oldType.productIds.splice(oldType.productIds.indexOf(prevProduct._id),1);
                await Type.findByIdAndUpdate(oldType._id,oldType);

                // add product id to new type
                const newType = await Type.findById(req.body.typeId);
                newType.productIds.push(prevProduct._id);
                await Type.findByIdAndUpdate(newType._id,newType);
            }

            if(prevProduct.brandId != req.body.brandId){
                // remove product id from old Brand
                const oldBrand = await Brand.findById(prevProduct.brandId);
                oldBrand.productIds.splice(oldBrand.productIds.indexOf(prevProduct._id),1);
                await Brand.findByIdAndUpdate(oldBrand._id,oldBrand);

                // add product id to new Brand
                const newBrand = await Brand.findById(req.body.brandId);
                newBrand.productIds.push(prevProduct._id);
                await Brand.findByIdAndUpdate(newBrand._id,newBrand);
            }

            req.flash('success',"Product Details Update successfully");
            return res.redirect('/product/viewProduct');

        }else{
            req.flash('error',"Failed to update Product");
            req.redirect('/product/viewProduct');
        }

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
};

module.exports.deactiveAllProduct = async (req,res)=>{
    try {
        const deactiveProduct = await Product.updateMany({_id:{$in:req.body.proIds}},{status:false});
        if(deactiveProduct){
            req.flash('success',"All Selected Product Deactivate");
            return res.redirect('back');
        }else{
            req.flash('error',"Failed to Deactivate Product");
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}


module.exports.operandAllDactiveProduct = async(req,res)=>{
    try {
        const allDeactiveProduct = await Product.find({_id:{$in:req.body.proIds}}).populate('brandId').populate('typeId').exec();
        if(req.body.activeAll){
            // deactive all selected Product 
            let productIds = allDeactiveProduct.map((item)=>{
                if(item.brandId.status && item.typeId.status){
                    return item._id;
                }
            });

            const activeAll = await Product.updateMany({_id:{$in:productIds}},{status:true});
            if(activeAll){
                req.flash('success',"All Selceted Product Activate Expext there Type or Brand not active");
                return res.redirect('back');
            }else{
                req.flash('error',"Failed active all Selected Product");
                return res.redirect('back');
            }

        }else{
            // delete all selected  Product 

            const deleteAll = await Product.deleteMany({_id:{$in:req.body.proIds}});
            if(deleteAll){
                allDeactiveProduct.map(async(item)=>{
                    try {
                        const deletePath = path.join(__dirname,'..',item.coverImage);
                        await fs.unlinkSync(deletePath);
                    } catch (err) {
                        console.log("Image Not Found");
                    }
    
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
                    singleType.productIds.splice(singleType.productIds.indexOf(item._id),1);
                    await Type.findByIdAndUpdate(singleType._id,singleType);

                    // remove product id from Brand
                    const singleBrand = await Brand.findById(item.brandId);
                    singleBrand.productIds.splice(singleBrand.productIds.indexOf(item._id),1);
                    await Brand.findByIdAndUpdate(singleBrand._id,singleBrand);
                });

                req.flash('success',"Delete all Selected Product");
                return res.redirect('back');
            }else{
                req.flash('error',"Failed to Delete Selected Product");
                return res.redirect('back');
            }
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}