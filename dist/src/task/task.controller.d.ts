import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
export declare class TaskController {
    private readonly taskService;
    constructor(taskService: TaskService);
    create(req: any, createTaskDto: CreateTaskDto): Promise<{
        task_id: string;
        message: string;
    }>;
    findAll(query: any): Promise<{
        total: number;
        page: number;
        page_size: number;
        page_data: {
            id: string;
            buyer_id: string;
            seller_id: string | null;
            price: number;
            deposit: number;
            buyer: {
                id: string;
                nickname: string | null;
                avatar: string | null;
                credit_score: number;
                level: number;
            };
            location: string | null;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            type: number;
            description: string | null;
            title: string;
            time_range: string | null;
            min_credit: number;
        }[];
    }>;
    myPublished(req: any, query: any): Promise<{
        page_data: {
            id: string;
            buyer_id: string;
            seller_id: string | null;
            price: number;
            deposit: number;
            buyer: {
                id: string;
                nickname: string | null;
                avatar: string | null;
                credit_score: number;
            };
            seller: {
                id: string;
                nickname: string | null;
                avatar: string | null;
                credit_score: number;
            } | null;
            location: string | null;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            type: number;
            description: string | null;
            title: string;
            time_range: string | null;
            min_credit: number;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    myAccepted(req: any, query: any): Promise<{
        page_data: {
            id: string;
            buyer_id: string;
            seller_id: string | null;
            price: number;
            deposit: number;
            buyer: {
                id: string;
                nickname: string | null;
                avatar: string | null;
                credit_score: number;
            };
            seller: {
                id: string;
                nickname: string | null;
                avatar: string | null;
                credit_score: number;
            } | null;
            location: string | null;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            type: number;
            description: string | null;
            title: string;
            time_range: string | null;
            min_credit: number;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        buyer_id: string;
        seller_id: string | null;
        price: number;
        deposit: number;
        buyer: {
            id: string;
            nickname: string | null;
            avatar: string | null;
            credit_score: number;
            level: number;
        };
        seller: {
            id: string;
            nickname: string | null;
            avatar: string | null;
            credit_score: number;
            level: number;
        } | null;
        location: string | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        type: number;
        description: string | null;
        title: string;
        time_range: string | null;
        min_credit: number;
    }>;
    accept(req: any, id: string): Promise<{
        message: string;
    }>;
    complete(req: any, id: string): Promise<{
        message: string;
    }>;
    cancel(req: any, id: string, reason: string): Promise<{
        message: string;
    }>;
}
