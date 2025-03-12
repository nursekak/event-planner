// import ApiError from '../errors/apiError.ts'
// import {Request, Response} from 'express'
// import { UploadedFile } from 'express-fileupload';
// import { Category, FastAnswers, Service, ServiceInfo } from '../models/models.ts'
// import { v4 as uuidv4 } from 'uuid';
// import path from 'path' 
// import { fileURLToPath } from 'url';
// import { AppDataSource } from '../data-source.ts';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const serviceRepository = AppDataSource.getRepository(Service);
// const CategoryRepository = AppDataSource.getRepository(Category)
// class ServiceController {
//     async create (req: Request & { files?: { img?: UploadedFile } }, res: Response, next) {
//         try {
//             const {header, body, info, category, faq} = req.body
//             let fileName: string;
//             if (!req.files || !req.files.img) {
//                 fileName = path.resolve(__dirname, '..', 'static', 'services_img01.jpg');
//             } else {
//                 const image = req.files.img;
//                 fileName = `${uuidv4()}.jpg`;
//                 await image.mv(path.resolve(__dirname, '..', 'static', fileName));
//             }

//             const categoryEntity = await CategoryRepository.findOneBy({id: parseInt(category)})

//             if (!categoryEntity) {
//                 return next(ApiError.badRequest("Категория не найдена"));
//             }
//             if (!categoryEntity) {
//                 return next(ApiError.badRequest("Категория не найдена"));
//             }
            
//             if (info && info.some(item => !item.type || !item.header || !item.textOne)) {
//                 return next(ApiError.badRequest("Неверный формат данных в поле info"));
//             }
            
//             if (faq && faq.some(item => !item.question || !item.answer)) {
//                 return next(ApiError.badRequest("Неверный формат данных в поле faq"));
//             }

//             const service = new Service();
//             service.header = header;
//             service.body = body;
//             service.img = fileName;
//             service.category = categoryEntity;



//             if (info) {
//                 service.info = this.createServiceInfo(info, service);
//             }
            
//             if (faq) {
//                 service.faq = this.createFastAnswers(faq, service); 
//             }

//             const savedService = await serviceRepository.save(service);

//             const result = await serviceRepository.findOne({
//                 where: { id: savedService.id },
//                 relations: ['category', 'info', 'faq']
//             });
            
//             return res.status(201).json(result);

//         } catch (error) {
//             if (error.code === '23505') {
//                 return next(ApiError.conflict("Запись уже существует"));
//             }
//             return next(ApiError.internal(error.message));
//         }
//     }
    
//     private createServiceInfo(info: any[], service: Service): ServiceInfo[] {
//         return info.map((item) => {
//             const serviceInfo = new ServiceInfo();
//             serviceInfo.type = item.type;
//             serviceInfo.header = item.header;
//             serviceInfo.textOne = item.textOne;
//             serviceInfo.textTwo = item.textTwo;
//             serviceInfo.img = item.img;
//             serviceInfo.service = service;
//             return serviceInfo;
//         });
//     }

//     private createFastAnswers(faq: any[], service: Service): FastAnswers[] {
//         return faq.map((item) => {
//             const fastAnswer = new FastAnswers();
//             fastAnswer.question = item.question;
//             fastAnswer.answer = item.answer;
//             fastAnswer.img = item.img;
//             fastAnswer.service = service;
//             return fastAnswer;
//         });
//     }

//     async delete(req: Request, res: Response, next) {
//         try {
//             const { id } = req.params; 

//             const service = await serviceRepository.findOneBy({ id: parseInt(id, 10) });
//             if (!service) {
//                 return next(ApiError.internal("Сервис не найден"));
//             }

//             await serviceRepository.remove(service);

//             return res.status(200).json({ message: "Сервис успешно удален" });
//         } catch (error) {
//             return next(ApiError.internal(error.message));
//         }
//     }
//     async getAll (req: Request, res: Response, next) {
//         try {
//             const services = await serviceRepository.find({
//                 relations: ['faq', 'info']
//             })
//             return res.json(services)
//         } catch (error) {
//             next(ApiError.badRequest(error.message))
//         }
//     }

//     // async getOne (req, res, next) {
//     //     try {
//     //         const {id} = req.params
//     //         const device = await Device.findOne({
//     //             where: {id},
//     //             include: [{model: DeviceInfo, as: 'info'}]
//     //         })
//     //         res.json(device)
//     //     } catch (error) {
//     //         next(ApiError.badRequest(error.message))
//     //     }
//     // }

// }

// export default new ServiceController()

