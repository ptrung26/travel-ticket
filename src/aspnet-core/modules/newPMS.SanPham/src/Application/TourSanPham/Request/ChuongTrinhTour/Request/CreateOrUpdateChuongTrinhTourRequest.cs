using MediatR;
using Microsoft.EntityFrameworkCore;
using newPMS.Entities;
using newPMS.Entities.ChietTinh;
using newPMS.TourSanPham.Dtos;
using Newtonsoft.Json;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Uow;

namespace newPMS.TourSanPham.Request
{
    public class CreateOrUpdateChuongTrinhTourRequest : ChuongTrinhTourDto, IRequest<CommonResultDto<long>>
    {
    }

    public class CreateOrUpdateChuongTrinhTourHandler : IRequestHandler<CreateOrUpdateChuongTrinhTourRequest, CommonResultDto<long>>
    {

        private readonly IOrdAppFactory _factory;
        public CreateOrUpdateChuongTrinhTourHandler(IOrdAppFactory factory)
        {
            _factory = factory;
        }
        public async Task<CommonResultDto<long>> Handle(CreateOrUpdateChuongTrinhTourRequest request, CancellationToken cancellationToken)
        {
            var _uow = _factory.UnitOfWorkManager.Begin(requiresNew: true, isTransactional: true); 
            try
            {
                var _repos = _factory.Repository<ChuongTrinhTourEntity, long>();
                var  _tourRepos =_factory.Repository<TourSanPhamEntity, long>();
                var _chietTinhXeRepos = _factory.Repository<ChietTinhDichVuXeEntity, long>();
                var _chietTinhVeRepos = _factory.Repository<ChietTinhDichVuVeEntity, long>();

                var csRepos = _factory.Repository<CodeSystemEntity, long>().AsNoTracking();
                var update = await _repos.GetAsync(request.Id);
                if (update == null)
                {
                    return new CommonResultDto<long>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Chương trình không tồn tại hoặc đã bị xoá"
                    };
                }

                _factory.ObjectMapper.Map<ChuongTrinhTourDto, ChuongTrinhTourEntity>(request, update);
                await _repos.UpdateAsync(update);

                var dichVu = JsonConvert.DeserializeObject<List<string>>(update.ListDichVuJson);
                var DichVuXeCode = "XeOto";
                var DichVuVeCode = "VeThangCanh";

                // Chiết tính xe ô tô
                if (dichVu.Contains(DichVuXeCode))
                {
                    var ctXe = _chietTinhXeRepos.Where(x => x.TourSanPhamId == update.TourSanPhamId).ToList();
                    if(ctXe.Count == 0)
                    {
                        var tourSanPham = _tourRepos.FirstOrDefault(x => x.Id == update.TourSanPhamId); 
                        if(tourSanPham == null)
                        {
                            await _uow.RollbackAsync(); 
                            return new CommonResultDto<long>
                            {
                                IsSuccessful = false,
                                ErrorMessage = "Tour sản phẩm không tồn tại hoặc đã bị xóa"
                            };
                        }

                        var insertChietTinhXe = new List<ChietTinhDichVuXeEntity>();
                        var khoangKhach = csRepos.Where(x => x.ParentCode == "SoChoXe").ToList(); 
                        for(var i = 1; i <= tourSanPham.SoNgay; ++i)
                        {
                            foreach(var item in khoangKhach)
                            {
                                insertChietTinhXe.Add(new ChietTinhDichVuXeEntity
                                {
                                    KhoangKhachCode = item.Code,
                                    TourSanPhamId = update.TourSanPhamId,
                                    NgayThu = i
                                }) ;
                            }
                        }

                        await _chietTinhXeRepos.InsertManyAsync(insertChietTinhXe);
                    }
                }
                else
                {
                    var ctXe = _chietTinhXeRepos.Where(x => x.TourSanPhamId == update.TourSanPhamId);
                    if (ctXe != null)
                    {
                        await _chietTinhXeRepos.DeleteManyAsync(ctXe); 
                    }
                }

                if (dichVu.Contains(DichVuVeCode))
                {
                    var ctPhong = _chietTinhVeRepos.Where(x => x.TourSanPhamId == update.TourSanPhamId).ToList();
                    if (ctPhong.Count == 0)
                    {
                        var tourSanPham = _tourRepos.FirstOrDefault(x => x.Id == update.TourSanPhamId);
                        if (tourSanPham == null)
                        {
                            await _uow.RollbackAsync();
                            return new CommonResultDto<long>
                            {
                                IsSuccessful = false,
                                ErrorMessage = "Tour sản phẩm không tồn tại hoặc đã bị xóa"
                            };
                        }

                        var insertChietTinhPhong = new List<ChietTinhDichVuVeEntity>();
                        var khoangPhong = csRepos.Where(x => x.ParentCode == "KhoangNguoi").ToList();
                        for (var i = 1; i <= tourSanPham.SoNgay; ++i)
                        {
                            foreach (var item in khoangPhong)
                            {
                                insertChietTinhPhong.Add(new ChietTinhDichVuVeEntity
                                {
                                    KhoangKhachCode = item.Code,
                                    TourSanPhamId = update.TourSanPhamId,
                                    NgayThu = i,
                                    
                                });
                            }
                        }

                        await _chietTinhVeRepos.InsertManyAsync(insertChietTinhPhong);
                    }
                }
                else
                {
                    var ctPhong = _chietTinhVeRepos.Where(x => x.TourSanPhamId == update.TourSanPhamId);
                    if (ctPhong != null)
                    {
                        await _chietTinhVeRepos.DeleteManyAsync(ctPhong);
                    }
                }

                await _uow.CompleteAsync();
                return new CommonResultDto<long>
                {
                    IsSuccessful = true,
                    DataResult = update.Id,
                };
            }
            catch (Exception ex)
            {
                await _uow.RollbackAsync();
                Console.WriteLine("SanPham_ChuongTrinhTour: " + ex.Message);
                return new CommonResultDto<long>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra, vui lòng thử lại sau!"
                };
            }
        }
    }
}
