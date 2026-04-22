import sys

file_path = r'e:\Projects\doggy_friend\backend\prisma\schema.prisma'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Edit users
users_old = '''  clock_num          Int       @default(0)
  college_id         BigInt?
  
  colleges           colleges? @relation(fields: [college_id], references: [id])'''
users_new = '''  clock_num          Int       @default(0)
  college_id         BigInt?
  
  // PRD New Fields
  real_name          String?   @db.VarChar(50)
  student_id         String?   @db.VarChar(20)
  credit_score       Int       @default(100)
  level              Int       @default(1) @db.TinyInt

  colleges           colleges? @relation(fields: [college_id], references: [id])'''
content = content.replace(users_old, users_new)

# Edit users relations
users_rel_old = '''  run_steps          run_steps[]'''
users_rel_new = '''  run_steps          run_steps[]
  
  tasks_bought       tasks[]        @relation("TaskBuyer")
  tasks_sold         tasks[]        @relation("TaskSeller")
  goods_sold         goods[]        @relation("GoodsSeller")
  goods_bought       goods_orders[] @relation("GoodsOrderBuyer")
  wallet             wallets?
  reviews_given      reviews[]      @relation("Reviewer")
  reviews_received   reviews[]      @relation("Reviewee")'''
content = content.replace(users_rel_old, users_rel_new)

# Edit chat_messages
chat_old = '''  to_user_id   BigInt
  content      String?   @db.LongText'''
chat_new = '''  to_user_id   BigInt
  task_id      BigInt?
  content      String?   @db.LongText'''
content = content.replace(chat_old, chat_new)

chat_index_old = '''  @@index([to_user_id], map: "chat_messages_to_user_id_index")'''
chat_index_new = '''  @@index([to_user_id], map: "chat_messages_to_user_id_index")
  @@index([task_id], map: "chat_messages_task_id_index")'''
content = content.replace(chat_index_old, chat_index_new)

# Append new models
new_models = '''

model tasks {
  id           BigInt    @id @default(autoincrement()) @db.UnsignedBigInt
  buyer_id     BigInt
  type         Int       @db.TinyInt // 1=代购, 2=搬运, 3=其他
  title        String    @db.VarChar(100)
  description  String?   @db.Text
  location     String?   @db.VarChar(100)
  time_range   String?   @db.VarChar(50)
  price        Decimal   @db.Decimal(10, 2)
  status       Int       @default(1) @db.TinyInt // 1=待接单, 2=进行中, 3=已完成, 4=取消
  seller_id    BigInt?
  deposit      Decimal   @default(0.00) @db.Decimal(10, 2)
  min_credit   Int       @default(0) @db.TinyInt
  created_at   DateTime? @db.Timestamp(0)
  updated_at   DateTime? @db.Timestamp(0)
  deleted_at   DateTime? @db.Timestamp(0)

  buyer        users     @relation("TaskBuyer", fields: [buyer_id], references: [id])
  seller       users?    @relation("TaskSeller", fields: [seller_id], references: [id])
  order        orders?

  @@index([buyer_id], map: "tasks_buyer_id_index")
  @@index([seller_id], map: "tasks_seller_id_index")
  @@index([status], map: "tasks_status_index")
}

model orders {
  id         BigInt    @id @default(autoincrement()) @db.UnsignedBigInt
  task_id    BigInt    @unique
  amount     Decimal   @db.Decimal(10, 2)
  status     Int       @default(0) @db.TinyInt // 0=未支付, 1=押金支付, 2=完成, 3=退款
  pay_time   DateTime? @db.Timestamp(0)
  created_at DateTime? @db.Timestamp(0)
  updated_at DateTime? @db.Timestamp(0)
  
  task       tasks     @relation(fields: [task_id], references: [id])
}

model goods {
  id          BigInt         @id @default(autoincrement()) @db.UnsignedBigInt
  seller_id   BigInt
  title       String         @db.VarChar(100)
  description String?        @db.Text
  category    String?        @db.VarChar(50)
  price       Decimal        @db.Decimal(10, 2)
  stock       Int            @default(1)
  created_at  DateTime?      @db.Timestamp(0)
  updated_at  DateTime?      @db.Timestamp(0)
  deleted_at  DateTime?      @db.Timestamp(0)

  seller      users          @relation("GoodsSeller", fields: [seller_id], references: [id])
  orders      goods_orders[]

  @@index([seller_id], map: "goods_seller_id_index")
}

model goods_orders {
  id         BigInt    @id @default(autoincrement()) @db.UnsignedBigInt
  goods_id   BigInt
  buyer_id   BigInt
  quantity   Int       @default(1)
  amount     Decimal   @db.Decimal(10, 2)
  status     Int       @default(0) @db.TinyInt // 0=待付款, 1=已支付, 2=取消
  pay_time   DateTime? @db.Timestamp(0)
  created_at DateTime? @db.Timestamp(0)
  updated_at DateTime? @db.Timestamp(0)

  goods      goods     @relation(fields: [goods_id], references: [id])
  buyer      users     @relation("GoodsOrderBuyer", fields: [buyer_id], references: [id])

  @@index([goods_id], map: "goods_orders_goods_id_index")
  @@index([buyer_id], map: "goods_orders_buyer_id_index")
}

model reviews {
  id          BigInt    @id @default(autoincrement()) @db.UnsignedBigInt
  order_id    BigInt    // Could refer to tasks.orders or goods_orders, keeping logic in app
  reviewer_id BigInt
  reviewee_id BigInt
  rating      Int       @db.TinyInt // 1~5
  comment     String?   @db.Text
  created_at  DateTime? @db.Timestamp(0)
  updated_at  DateTime? @db.Timestamp(0)

  reviewer    users     @relation("Reviewer", fields: [reviewer_id], references: [id])
  reviewee    users     @relation("Reviewee", fields: [reviewee_id], references: [id])

  @@index([order_id], map: "reviews_order_id_index")
  @@index([reviewer_id], map: "reviews_reviewer_id_index")
  @@index([reviewee_id], map: "reviews_reviewee_id_index")
}

model wallets {
  user_id        BigInt    @id
  balance        Decimal   @default(0.00) @db.Decimal(12, 2)
  frozen_balance Decimal   @default(0.00) @db.Decimal(12, 2)
  created_at     DateTime? @db.Timestamp(0)
  updated_at     DateTime? @db.Timestamp(0)

  user           users     @relation(fields: [user_id], references: [id])
}
'''
if 'model tasks {' not in content:
    content += new_models

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')