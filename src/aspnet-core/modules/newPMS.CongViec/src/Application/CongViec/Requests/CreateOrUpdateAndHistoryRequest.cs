using MediatR;
using newPMS.Entities;
using OrdBaseApplication.Dtos;
using OrdBaseApplication.Factory;
using System;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;
using static newPMS.CommonEnum;
using Volo.Abp.Uow;
using System.Linq;

namespace newPMS.CongViec.Request
{
    public class CreateOrUpdateAndHistoryRequest : IRequest<CommonResultDto<bool>>
    {
        public long CongViecId { get; set; }
        public int? TrangThaiCVNho { get; set; }
        public int? TrangThaiCVLon { get; set; }
        public long? SysUserId { get; set; }
        public DateTime? NgayKetThuc { get; set; }
        public string Ghichu { get; set; }
    }

    public class CreateOrUdateAndHistoryHandler : IRequestHandler<CreateOrUpdateAndHistoryRequest, CommonResultDto<bool>>
    {
        private readonly IOrdAppFactory _factory;
        private readonly IRepository<CongViecLichSuEntity, long> _lichSuRepos;
        private readonly IRepository<CongViecUserEntity, long> _congViecUserRepos;
        private readonly IRepository<CongViecEntity, long> _congViecRepos;
        private readonly IRepository<SysUserEntity, long> _sysUserRepos;
        public CreateOrUdateAndHistoryHandler(IOrdAppFactory factory,
                IRepository<CongViecLichSuEntity, long> lichSuRepos,
                IRepository<CongViecEntity, long> congViecRepos,
                IRepository<CongViecUserEntity, long> congViecUserRepos,
                IRepository<SysUserEntity, long> sysUserRepos)
        {
            _factory = factory;
            _lichSuRepos = lichSuRepos;
            _congViecRepos = congViecRepos;
            _congViecUserRepos = congViecUserRepos;
            _sysUserRepos = sysUserRepos;
        }
        public async Task<CommonResultDto<bool>> Handle(CreateOrUpdateAndHistoryRequest input, CancellationToken cancellation)
        {
            using var uow = _factory.UnitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
            try
            {
                var userSession = _factory.UserSession;
                var congViec = await _congViecRepos.FirstOrDefaultAsync(x => x.Id == input.CongViecId);
                var formatDate = "dd/MM/yyyy";
                if (congViec != null)
                {
                    if (input.NgayKetThuc.HasValue)
                    {
                        var oldTime = congViec.NgayKetThuc.HasValue ? Convert.ToDateTime(congViec.NgayKetThuc).ToString(formatDate) : "chưa có";
                        congViec.NgayKetThuc = input.NgayKetThuc;
                        await _congViecRepos.UpdateAsync(congViec);

                        var history = new CongViecLichSuEntity();
                        history.CongViecId = congViec.ParentId;
                        history.SysUserId = userSession.SysUserId;
                        history.HanhDong = $"Thay đổi thời gian kết thúc từ {oldTime} đến {Convert.ToDateTime(input.NgayKetThuc).ToString(formatDate)}.";
                        history.GhiChu = input.Ghichu;
                        await _lichSuRepos.InsertAsync(history);
                    }

                    if (input.TrangThaiCVNho.HasValue)
                    {

                        var trangThaiCu = CommonEnum.GetEnumDescription((TRANG_THAI_CONG_VIEC)congViec.TrangThai);
                        var trangThaiMoi = CommonEnum.GetEnumDescription((TRANG_THAI_CONG_VIEC)input.TrangThaiCVNho);
                        //update
                        //congViec.TrangThai = input.TrangThaiCVNho;
                        //congViec.IsHoanThanh = input.TrangThaiCVNho == (int)TRANG_THAI_CONG_VIEC.HOAN_THANH ? true : false;
                        //congViec.NgayHoanThanh = input.TrangThaiCVNho == (int)TRANG_THAI_CONG_VIEC.HOAN_THANH ? DateTime.Today : null;

                        var history = new CongViecLichSuEntity();
                        history.CongViecId = congViec.ParentId;
                        history.SysUserId = userSession.SysUserId;
                        history.HanhDong = $"Thay đổi Trạng Thái công việc nhỏ: {congViec.Ten} từ {trangThaiCu} sang {trangThaiMoi}.";
                        history.GhiChu = input.Ghichu;
                        await _lichSuRepos.InsertAsync(history);

                    }

                    if (input.TrangThaiCVLon.HasValue)
                    {
                        if (congViec.TrangThai == (int)TRANG_THAI_CONG_VIEC.HOAN_THANH)
                        {
                            return new CommonResultDto<bool>
                            {
                                IsSuccessful = false,
                                ErrorMessage = "Công việc đã hoàn thành!"
                            };
                        }
                        var trangThaiCu = CommonEnum.GetEnumDescription((TRANG_THAI_CONG_VIEC)congViec.TrangThai);
                        var trangThaiMoi = CommonEnum.GetEnumDescription((TRANG_THAI_CONG_VIEC)input.TrangThaiCVLon);

                        var congViecLon = await _congViecRepos.FirstOrDefaultAsync(x => x.Id == input.CongViecId);
                        if (congViecLon != null)
                        {
                            congViecLon.TrangThai = input.TrangThaiCVLon;
                            congViecLon.IsHoanThanh = input.TrangThaiCVLon == (int)TRANG_THAI_CONG_VIEC.HOAN_THANH ? true : false;
                            congViecLon.NgayHoanThanh = input.TrangThaiCVLon == (int)TRANG_THAI_CONG_VIEC.HOAN_THANH ? DateTime.Today : null;

                            await _congViecRepos.UpdateAsync(congViecLon);

                            var history = new CongViecLichSuEntity();
                            history.CongViecId = congViec.Id;
                            history.SysUserId = userSession.SysUserId;
                            history.HanhDong = $"Thay đổi trạng thái công việc: {congViec.Ten} từ {trangThaiCu} sang {trangThaiMoi}.";
                            history.GhiChu = input.Ghichu;
                            await _lichSuRepos.InsertAsync(history);
                        }
                    }

                    if (input.SysUserId.HasValue)
                    {
                        var congViecUser =  _congViecUserRepos.FirstOrDefault(x => x.CongViecId == congViec.Id);
                        var newUser = _sysUserRepos.FirstOrDefault(x => x.Id == input.SysUserId);
                        var newUserName = newUser != null ? newUser.HoTen : "Chưa phân công";

                        var oldUser = congViecUser != null ? _sysUserRepos.FirstOrDefault(x => x.Id == congViecUser.SysUserId) : null;
                        var oldUserName = oldUser != null ? newUser.HoTen : "Chưa phân công";
                        if (congViecUser != null)
                        {
                            await _congViecUserRepos.DeleteAsync(x => x.CongViecId == congViecUser.CongViecId && x.SysUserId == congViecUser.SysUserId);
                        }
                        var newCongViecUSer = new CongViecUserEntity();
                        newCongViecUSer.SysUserId = input.SysUserId;
                        newCongViecUSer.CongViecId = input.CongViecId;
                        await _congViecUserRepos.InsertAsync(newCongViecUSer);

                        var history = new CongViecLichSuEntity();
                        history.CongViecId = congViec.ParentId;
                        history.SysUserId = userSession.SysUserId;
                        history.HanhDong = $"Thay đổi người thực hiện của công việc nhỏ: {congViec.Ten} từ {oldUserName} sang {newUserName}.";
                        history.GhiChu = input.Ghichu;
                        await _lichSuRepos.InsertAsync(history);
                    }

                    await uow.CompleteAsync();
                    return new CommonResultDto<bool>
                    {
                        IsSuccessful = true,

                    };
                }
                else
                {
                    await uow.RollbackAsync();
                    return new CommonResultDto<bool>
                    {
                        IsSuccessful = false,
                        ErrorMessage = "Không tìm thấy công việc!"
                    };
                }

            }
            catch (Exception ex)
            {
                await uow.RollbackAsync();
                return new CommonResultDto<bool>
                {
                    IsSuccessful = false,
                    ErrorMessage = "Có lỗi xảy ra"
                };
            }


        }

    }
}
