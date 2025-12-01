using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceToProduc1233 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Carts_Customers_CustomerId1",
                table: "Carts");

            migrationBuilder.DropIndex(
                name: "IX_Carts_CustomerId1",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "CustomerId1",
                table: "Carts");

            migrationBuilder.RenameColumn(
                name: "CartQuantity",
                table: "CartItem",
                newName: "Quantity");

            migrationBuilder.AlterColumn<string>(
                name: "PasswordSalt",
                table: "Customers",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "Customers",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<int>(
                name: "CustomerId",
                table: "Carts",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Carts",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Carts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "CartItem",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateIndex(
                name: "IX_Carts_CustomerId",
                table: "Carts",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Carts_Customers_CustomerId",
                table: "Carts",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Carts_Customers_CustomerId",
                table: "Carts");

            migrationBuilder.DropIndex(
                name: "IX_Carts_CustomerId",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Carts");

            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "CartItem");

            migrationBuilder.RenameColumn(
                name: "Quantity",
                table: "CartItem",
                newName: "CartQuantity");

            migrationBuilder.AlterColumn<string>(
                name: "PasswordSalt",
                table: "Customers",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "Customers",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CustomerId",
                table: "Carts",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<int>(
                name: "CustomerId1",
                table: "Carts",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Carts_CustomerId1",
                table: "Carts",
                column: "CustomerId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Carts_Customers_CustomerId1",
                table: "Carts",
                column: "CustomerId1",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
