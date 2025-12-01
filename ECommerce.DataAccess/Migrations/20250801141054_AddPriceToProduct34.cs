using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ECommerce.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceToProduct34 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Stocks",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Stocks",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Category", "Code", "Description", "ImageUrl", "IsActive", "IsFavorite", "Name", "Price", "ReturnId", "SaleId" },
                values: new object[,]
                {
                    { 3, "deneme kategori", "sad", "deneme ürünü", "indir.jpg", true, false, "Kıyafet", "1000", null, null },
                    { 4, "deneme kategori", "sad", "deneme ürünü", "indir.jpeg", true, false, "Kıyafet", "900", null, null }
                });

            migrationBuilder.InsertData(
                table: "Stocks",
                columns: new[] { "Id", "MonthlyTurnoverId", "ProductId", "Quantity", "StoreId" },
                values: new object[,]
                {
                    { 4, null, 3, 100, 1 },
                    { 5, null, 4, 123, 1 }
                });
        }
    }
}
