const Category = require('../models/CategoryModel');
const SubCategory = require('../models/SubCategoryModel');
const ExtraCategory = require('../models/ExtraCategoryModel');
const Type = require('../models/TypeModel');

module.exports.addType = async(req,res)=>{
    try {
        
        const allCategory  = await Category.find({status:true});

        return res.render('type/addType',{
            allCategory,
        })

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.getSubCategory = async(req,res)=>{
    try {
        const allSubCatBaseCat = await SubCategory.find({status:true,categoryId:req.params.catId});
        return res.json(allSubCatBaseCat);
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/subCategory');
    }
}

module.exports.getExtraCategory = async(req,res)=>{
    try {
        const allExCatBaseSubCat = await ExtraCategory.find({status:true,subCategoryId:req.params.subCatId});
        return res.json(allExCatBaseSubCat);
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('/subCategory');
    }
}

module.exports.insertType = async(req,res)=>{
    try {

        const addedType = await Type.create(req.body);
        if(addedType){

            const singleExtraCategory = await ExtraCategory.findById(addedType.extraCategoryId);
            singleExtraCategory.typeIds.push(addedType._id);
            await ExtraCategory.findByIdAndUpdate(singleExtraCategory._id,singleExtraCategory);

            req.flash('success',"Type Added Successfully");
            console.log("Type Added Successfully")
            return res.redirect('/type');
        }else{
            req.flash('error',"Failed to Add Type");
            console.log("Failed to Add Type");
            return res.redirect('/type');
        }
        
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.viewType = async(req,res)=>{
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

        const allTypes = await Type.find({
            ...(date && {createdAt:{$gte:new Date(new Date(date).setHours(0,0,0,0)),$lte:new Date(new Date(date).setHours(23,59,59,999))}}),
            $or:[
                {typeName:{$regex:searchValue,$options:'i'}},
            ]
        }).sort({...(sort&&{[sortType]:sort})}).populate('categoryId').populate('subCategoryId').populate('extraCategoryId').exec();

        return res.render('type/viewType',{
            allTypes,
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

module.exports.changeTypeStatus = async(req,res)=>{
    try {
        const {id,status} = req.params;
        const singleType = await Type.findById(id).populate('extraCategoryId');
        if(status=='true'){
            if(!singleType.extraCategoryId.status){
                req.flash('error',"The Extra Category is not Active")
                return res.redirect('back');
            }
        }

        const typeStatusChange = await Type.findByIdAndUpdate(id,{status:status});
        if(typeStatusChange){
            req.flash('success',"Type Status Change Successfully");
            console.log("Type Status Change Successfully")
            return res.redirect('back');
        }else{
            req.flash('error',"Failed to Change Type Status");
            console.log("Failed to Change Type Status");
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
};

module.exports.deleteType = async(req,res)=>{
    try {
        const deletedType = await Type.findByIdAndDelete(req.params.id); 
        if(deletedType){
            // remove deleted  type id frome extra category 
            const singleExtraCategory = await ExtraCategory.findById(deletedType.extraCategoryId);
            singleExtraCategory.typeIds.splice(singleExtraCategory.typeIds.indexOf(singleExtraCategory._id),1);
            await ExtraCategory.findByIdAndUpdate(singleExtraCategory._id,singleExtraCategory);

        }else{
            req.flash('error',"failed to Delete Type")
            console.log("failed to Delete Type");
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}

module.exports.updateType = async(req,res)=>{
    try {
        const allCategory  = await Category.find({status:true});
        const singleType = await Type.findById(req.params.id);
        const allSubCatBaseCat = await SubCategory.find({status:true,categoryId:singleType.categoryId});
        const allExCatBaseSubCat = await ExtraCategory.find({status:true,subCategoryId:singleType.subCategoryId});
        return res.render('type/updateType',{
            singleType,
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

module.exports.editType = async(req,res)=>{
    try {
        const prevType = await Type.findByIdAndUpdate(req.body.id,req.body);
        if(prevType){
            if(prevType.extraCategoryId != req.body.extraCategoryId){
                // remove type id from prev extra category 
                const oldExCategory = await ExtraCategory.findById(prevType.extraCategoryId);
                oldExCategory.typeIds.splice(oldExCategory.typeIds.indexOf(prevType._id),1);
                await ExtraCategory.findByIdAndUpdate(oldExCategory._id,oldExCategory);

                // add type id to new extra Category 
                const newExCategory = await ExtraCategory.findById(req.body.extraCategoryId);
                newExCategory.typeIds.push(prevType._id);
                await ExtraCategory.findByIdAndUpdate(newExCategory._id,newExCategory);

            }
            req.flash('success',"Type Updated Successfully");
            console.log("Type Updated Successfully");
            return res.redirect('/type/viewType')
        }else{
            req.flash('error',"Failed to Update Type");
            console.log("Failed to Update Type");
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
};

module.exports.deactiveAllType = async(req,res)=>{
    try {
        const deactiveAll = await Type.updateMany({_id:{$in:req.body.typeIds}},{status:false});
        if(deactiveAll){
            req.flash('success',"Deactive All Selected Type");
            console.log("Deactive All Selected Type");
            return res.redirect('back');
        }else{
            req.flash('error',"Failed to Deactive All Selected Type");
            console.log("Failed to Deactive All Selected Type");
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
};

module.exports.operandAllDactiveType = async(req,res)=>{
    try {
        const allDeactiveType = await Type.find({_id:{$in:req.body.typeIds}}).populate('extraCategoryId');
        if(req.body.activeAll){
            const typeIds = allDeactiveType.map((item)=>{
                if(item.extraCategoryId.status){
                    return item._id;
                }
            });

            const updateType = await Type.updateMany({_id:{$in:typeIds}},{status:true});
            if(updateType){
                req.flash('success',"Active all Seleted Type Expect if them Sub category Not Active");
                console.log("Active all Seleted Type Expect if them Sub category Not Active");
                return res.redirect('back');
            }else{
                req.flash('error',"Failed to Active all Seleted Type");
                console.log("Failed to Active all Seleted Type");
                return res.redirect('back');
            }

        }else{
            allDeactiveType.map(async (item)=>{
                const sinleExCategory = await ExtraCategory.findById(item.extraCategoryId);
                sinleExCategory.typeIds.splice(sinleExCategory.typeIds.indexOf(item._id),1);
                await ExtraCategory.findByIdAndUpdate(sinleExCategory._id,sinleExCategory);
            });

            const deleteType = await Type.deleteMany({_id:{$in:req.body.typeIds}});
            if(deleteType){
                req.flash('success',"Delete all Seleted Type");
                console.log("Delete all Seleted Type");   
                return res.redirect('back');
            }else{
                req.flash('error',"Failed to Delete all Seleted Type");
                console.log("Failed to Delete all Seleted Type");
                return res.redirect('back');
            }
        }
        
    } catch (err) {
        req.flash('error',"Somthing Wrong")
        console.log("Some thing wrong",err);
        return res.redirect('back');
    }
}
