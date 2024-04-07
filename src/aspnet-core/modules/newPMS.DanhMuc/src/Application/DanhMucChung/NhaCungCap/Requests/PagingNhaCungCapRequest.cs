using Dapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.DanhMuc.Dtos;
using newPMS.Entities;
using OrdBaseApplication;
using OrdBaseApplication.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace newPMS.DanhMuc.Requests
{
    public class PagingNhaCungCapRequest : PagedFullRequestDto, IRequest<PagedResultDto<NhaCungCapDto>>
    {
        public bool? TrangThai { get; set; }
        public List<string> ListPhanLoai { get; set; }
    }

    public class PagingNhaCungCapRequestHandler : AppBusinessBase, IRequestHandler<PagingNhaCungCapRequest, PagedResultDto<NhaCungCapDto>>
    {
        public async Task<PagedResultDto<NhaCungCapDto>> Handle(PagingNhaCungCapRequest input, CancellationToken cancellationToken)
        {
            try
            {
                var queryBuilder = new StringBuilder();
                var queryTotal = new StringBuilder();
                var queryClause = new StringBuilder($@"
			            SELECT 
					            npp.Id,
					            npp.Ten,
					            npp.TenVietTat,
					            npp.DiaChi,
                                npp.TinhId,
                                npp.HuyenId,
                                npp.QuocGiaId,
                                npp.XaId,
                                q.Ten as TenQuocGia,
                                t.Ten as TenTinh,
                                h.Ten as TenHuyen,
                                x.Ten as TenXa,
                                npp.SoDangKyKinhDoanh,
                                npp.Logo,
					            npp.TruSo,
					            npp.DaiDien,
                                npp.PhanLoai,
					            npp.TrangThai,
					            npp.CreationTime as NgayDangKy,
                                npp.TenNguoiDaiDien,
					            npp.DienThoaiNguoiDaiDien,
					            npp.EmailNguoiDaiDien
			            FROM 
                                dm_nhaphanphoi as npp
                                LEFT JOIN dm_tinh as t on npp.TinhId = t.Id 
					            LEFT JOIN dm_huyen as h on npp.HuyenId = h.Id
					            LEFT JOIN dm_xa as x on npp.XaId = x.Id 
					            LEFT JOIN dm_quocgia as q on npp.QuocGiaId = q.Id 
			            WHERE
					            npp.IsDeleted = 0 
                ");
                var whereClase = new StringBuilder();
                if (!string.IsNullOrEmpty(input.Filter))
                {
                    whereClase.Append($"" +
                        $" AND ( LOWER(npp.Ten) LIKE '%{input.Filter.Trim().ToLower()}%' " +
                        $" OR    LOWER(npp.TenVietTat) LIKE '%{input.Filter.Trim().ToLower()}%' " +
                        $" OR    LOWER(npp.DiaChi) LIKE '%{input.Filter.Trim().ToLower()}%' " +
                        $" OR    LOWER(npp.TenNguoiDaiDien) LIKE '%{input.Filter.Trim().ToLower()}%' )");
                }
                if ((input.TrangThai.HasValue))
                {
                    whereClase.Append($" AND npp.TrangThai = '{Convert.ToInt32(input.TrangThai)}' ");
                }

                if (input.ListPhanLoai?.Count > 0)
                {
                    whereClase.Append("AND (");

                    for (var pl = 1; pl <= input.ListPhanLoai.Count; pl++)
                    {
                        whereClase.Append($" npp.PhanLoai LIKE '%{input.ListPhanLoai[pl - 1]}%' ");
                        if (pl < input.ListPhanLoai.Count)
                        {
                            whereClase.Append(" OR ");
                        }
                    }

                    whereClase.Append(")");
                }

                var sortClause = new StringBuilder(" GROUP BY npp.Id ORDER BY npp.Id desc");
                var pagingClause = $"LIMIT {input.MaxResultCount} OFFSET {input.SkipCount} ";
                queryBuilder.Append($"{queryClause} {whereClase} {sortClause} {pagingClause} ");
                queryTotal.Append($"{queryClause} {whereClase} {sortClause}");
                var items = await Factory.TravelTicketDbFactory.Connection.QueryAsync<NhaCungCapDto>(queryBuilder.ToString());
                var totalCount = await Factory.TravelTicketDbFactory.Connection.QueryAsync<NhaCungCapDto>(queryTotal.ToString());
                var dataGrid = items.ToList();

                var listLoaiNhaCungCap = Factory.Repository<CodeSystemEntity, long>().Where(x => x.ParentCode == "PhanLoaiNhaCungCap").ToList();
                if (listLoaiNhaCungCap?.Count > 0)
                {
                    foreach (var item in dataGrid)
                    {
                        var listNhaPhanPhoi = item.PhanLoai.Split(",").ToList().Select(s =>
                        {
                            var nhaPhanPhoi = listLoaiNhaCungCap.FirstOrDefault(x => x.Code == s);
                            return nhaPhanPhoi != null ? nhaPhanPhoi.Display : "";
                        }).ToList();
                        item.PhanLoaiStr = String.Join(",", listNhaPhanPhoi);
                    }
                }

                return new PagedResultDto<NhaCungCapDto>
                {
                    Items = dataGrid,
                    TotalCount = totalCount.Count()
                };
            }
            catch (Exception ex) {
                throw ex; 
            }

        }
    }
}
