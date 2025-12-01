using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerce.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Returns_ReturnId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_ReturnId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ReturnId",
                table: "Products");

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "Returns",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Returns_ProductId",
                table: "Returns",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Returns_Products_ProductId",
                table: "Returns",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Returns_Products_ProductId",
                table: "Returns");

            migrationBuilder.DropIndex(
                name: "IX_Returns_ProductId",
                table: "Returns");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "Returns");

            migrationBuilder.AddColumn<int>(
                name: "ReturnId",
                table: "Products",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_ReturnId",
                table: "Products",
                column: "ReturnId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Returns_ReturnId",
                table: "Products",
                column: "ReturnId",
                principalTable: "Returns",
                principalColumn: "Id");
        }
    }
}
