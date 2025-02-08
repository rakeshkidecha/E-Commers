const Category = require('../models/CategoryModel');
const SubCategory = require('../models/SubCategoryModel');
const ExtraCategory = require('../models/ExtraCategoryModel');
const Brand = require('../models/BrandModel');

module.exports.addBrand = async(req,res)=>{
    try {
        const allCategory = await Category.find({status:true});
        return res.render('brand/addBrand',{allCategory});
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
};

module.exports.getSubCategory = async(req,res)=>{
    try {
        const allSubCatBaseCat = await SubCategory.find({status:true,categoryId:req.params.catId});
        console.log(allSubCatBaseCat)
        return res.json(allSubCatBaseCat);
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/brand');
    }
}

module.exports.getExtraCategory = async(req,res)=>{
    try {
        const allExCatBaseSubCat = await ExtraCategory.find({status:true,subCategoryId:req.params.subCatId});

        return res.json(allExCatBaseSubCat);
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/brand');
    }
};

module.exports.insertBrand = async(req,res)=>{
    try {
        const addedBrand = await Brand.create(req.body);
        if(addedBrand){
            const singleExCat = await ExtraCategory.findById(addedBrand.extraCategoryId);
            singleExCat.brandIds.push(addedBrand._id);
            await ExtraCategory.findByIdAndUpdate(singleExCat._id,singleExCat);

            req.flash('success',"Brand add Successfully");
            console.log("Brand add Successfully");
            return res.redirect('/brand');
        }else{
            req.flash('error',"Failed to Add Brand");
            console.log("Failed to Add Brand");
            return res.redirect('/brand');
        }
        
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/brand');
    }
};

module.exports.viewBrand = async(req,res)=>{
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

        const allBrand = await Brand.find({
            ...(date && {createdAt:{$gte:new Date(new Date(date).setHours(0,0,0,0)),$lte:new Date(new Date(date).setHours(23,59,59,999))}}),
            $or:[
                {brandName:{$regex:searchValue,$options:'i'}},
            ]
        }).sort({...(sort&&{[sortType]:sort})}).populate('categoryId').populate('subCategoryId').populate('extraCategoryId').exec();

        return res.render('brand/viewBrand',{
            allBrand,
            searchValue,
            date,
            sort,
            sortType,
        });
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
};

module.exports.changeBrandStatus = async (req,res)=>{
    try {
        const {id,status} = req.params;
        const singleBrand = await Brand.findById(id).populate('extraCategoryId').exec();
        if(status == 'true' && !singleBrand.extraCategoryId.status){
            req.flash('error',"The Extra Category is not Active");
            console.log("The Extra Category is not Active");
            return res.redirect('back');
        }

        const updateBrand = await Brand.findByIdAndUpdate(id,{status:status});
        if(updateBrand){
            req.flash('success',"Brand Status Change");
            console.log("Brand Status Change");
            return res.redirect('back');
        }else{
            req.flash('error',"Failed to Update Status");
            console.log("Failed to Update Status");
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
};

module.exports.deleteBrand = async (req,res)=>{
    try {
        const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
        if(deletedBrand){
            // remove brand  id from extra category 
            const singleExCat = await ExtraCategory.findById(deletedBrand.extraCategoryId);
            singleExCat.brandIds.splice(singleExCat.brandIds.indexOf(deletedBrand._id),1);
            await ExtraCategory.findByIdAndUpdate(singleExCat._id,singleExCat);

            req.flash('success',"Brand Deleted");
            console.log("Brand Deleted");
            return res.redirect('back');
        }else{
            req.flash('error',"Failed to Delete Brand");
            console.log("Failed to Delete Brand");
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
};

module.exports.updateBrand = async(req,res)=>{
    try {
        const singleBrand = await Brand.findById(req.params.id);
        const allCategory = await Category.find({status:true});
        const allSubCatBaseCat = await SubCategory.find({status:true,categoryId:singleBrand.categoryId});
        const allExCatBaseSubCat = await ExtraCategory.find({status:true,subCategoryId:singleBrand.subCategoryId});

        return res.render('brand/updateBrand',{
            singleBrand,
            allCategory,
            allSubCatBaseCat,
            allExCatBaseSubCat
        })

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
};

module.exports.editBrand = async(req,res)=>{
    try {
        const prevBrand = await Brand.findByIdAndUpdate(req.body.id,req.body);
        if(prevBrand){

            if(prevBrand.extraCategoryId != req.body.extraCategoryId){
                // remove Brand id form old extra category 
                const singleExCat = await ExtraCategory.findById(prevBrand.extraCategoryId);
                singleExCat.brandIds.splice(singleExCat.brandIds.indexOf(prevBrand._id),1);
                await ExtraCategory.findByIdAndUpdate(singleExCat._id,singleExCat);

                // add brand id to extra Category 
                const newExCat = await ExtraCategory.findById(req.body.extraCategoryId);
                newExCat.brandIds.push(prevBrand._id);
                await ExtraCategory.findByIdAndUpdate(newExCat._id,newExCat);
            }

            req.flash('success',"Brand Updated Successfully");
            console.log("Brand Updated Successfully");
            return res.redirect('/brand/viewBrand');
        }else{
            req.flash('error',"Failed to Update Brand");
            console.log("Failed to Update Brand");
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
};

module.exports.deactiveAllBrand = async (req,res)=>{
    try {
        const deactivBrand = await Brand.updateMany({_id:{$in:req.body.brandIds}},{status:false});
        if(deactivBrand){
            req.flash('success',"Deactive all Select Brand");
            console.log("Deactive all Select Brand");
            return res.redirect('back');
        }else{
            req.flash('error',"Failed to Deactive all Select Brand");
            console.log("Failed to Deactive all Select Brand");
            return res.redirect('back');
        }
        
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
};

module.exports.operandAllDactiveBrand = async(req,res)=>{
    try {
        const allDeactiveBrand = await Brand.find({_id:{$in:req.body.brandIds}}).populate('extraCategoryId').exec();
        if(req.body.activeAll){

            const brandIds = allDeactiveBrand.map((item)=>{
                if(item.extraCategoryId.status){
                    return item._id;
                }
            });

            const activeBrand = await Brand.updateMany({_id:{$in:brandIds}},{status:true});
            if(activeBrand){
                req.flash('success',"Active all Select Brand Expect which ExtraCategory not Active");
                console.log("Active all Select Brand Expect which ExtraCategory not Active");
                return res.redirect('back');
            }else{
                req.flash('error',"Failed to Active all Select Brand");
                console.log("Failed to Active all Select Brand");
                return res.redirect('back');
            }

        }else{
            const deleteBrand = await Brand.deleteMany({_id:{$in:req.body.brandIds}});
            if(deleteBrand){
                allDeactiveBrand.map(async(item)=>{
                    // remove brnad id from extra category 
                    const singleExCat = await ExtraCategory.findById(item.extraCategoryId);
                    singleExCat.brandIds.splice(singleExCat.brandIds.indexOf(item._id),1);
                    await ExtraCategory.findByIdAndUpdate(singleExCat._id,singleExCat);
                });

                req.flash('success',"Delete All Selected Brand");
                console.log("Delete All Selected Brand");
                return res.redirect('back');
            }else{
                req.flash('error',"Failed to Delete Selected Brand");
                console.log("Failed to Delete Selected Brand");
                return res.redirect('back');
            }
        }
        
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}