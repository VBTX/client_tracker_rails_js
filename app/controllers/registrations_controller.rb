class RegistrationsController < Devise::RegistrationsController

	private

	def sign_up_params
		params.require(:user).permit(:name, :email, :password, :business_name, :with_business_name, :business_id, :password_confirmation)
	end

	def update_resource(resource, params)
		resource.update_without_password(params)
	end

	def account_update_params
		params.require(:user).permit(:name, :email, :password, :password_confirmation, :business_name, :business_address, :business_id, :current_password)
	end
end
