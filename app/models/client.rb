class Client < ApplicationRecord
	belongs_to :user
	has_many :projects
	has_many :invoices, through: :projects
	validates_presence_of :business_name
	validates :business_name, :uniqueness => {:scope=>:user_id}
end
